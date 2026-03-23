########################################
# 1) SNS Topic 생성
# 2) Lambda 함수 생성 (Slack Webhook 호출)
# 3) IAM Role/Policy 설정 (Lambda 실행 + CloudWatch Logs)
# 4) SNS -> Lambda 구독(Subscription) 연결
# 5) Lambda 환경변수로 Slack Webhook URL 주입
########################################

terraform {
  required_version = ">= 1.5.0"

  # 사용 Provider 버전 고정(팀 협업에서 재현성 확보)
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    # 로컬 디렉토리를 zip으로 묶어 Lambda 배포 패키지 생성
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.4"
    }
    # 이름 충돌 방지용 난수 suffix 생성
    random = {
      source  = "hashicorp/random"
      version = ">= 3.6"
    }
  }
}

########################################
# AWS Provider: 리전 지정
########################################
provider "aws" {
  region = var.aws_region
}

########################################
# 리소스 이름 충돌 방지용 suffix
# (SNS Topic / Lambda name은 계정 내에서 중복되면 생성 실패 가능)
########################################
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

# 최종 리소스 이름 구성
locals {
  full_topic_name  = "${var.sns_topic_name}-${random_string.suffix.result}"
  full_lambda_name = "${var.lambda_function_name}-${random_string.suffix.result}"
}

########################################
# 1) SNS Topic
# - OutboxPublisher가 publish 하는 대상
# - Standard topic 전제
########################################
resource "aws_sns_topic" "gas_alert" {
  name = local.full_topic_name
}

########################################
# 2) Lambda 실행 Role
# - Lambda 서비스가 assume(위임)할 수 있어야 함
# - assume_role_policy 는 "Lambda가 이 Role을 사용할 수 있다"는 신뢰정책
########################################
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role-${random_string.suffix.result}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

########################################
# 2-1) CloudWatch Logs 권한 부여
# - Lambda가 실행 로그를 CloudWatch에 남기려면 필요
# - AWS 관리형 정책(AWSLambdaBasicExecutionRole) 사용
########################################
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

########################################
# 3) Lambda 코드 ZIP 패키징
# - lambda/slack-notifier 디렉토리를 zip으로 묶어서 배포
# - output_path는 terraform 로컬 작업 디렉토리에 생성됨
########################################
data "archive_file" "lambda_zip" {
  type = "zip"
  # path.module = infra/terraform
  # "../../lambda/slack-notifier" = repo root의 lambda 코드
  source_dir  = "${path.module}/../../lambda/slack-notifier"
  output_path = "${path.module}/.build/slack-notifier.zip"
}

########################################
# 4) Lambda 함수
# - runtime: nodejs24.x
# - handler: index.handler
#   -> zip 내부에 index.mjs(또는 index.js)에 export const handler 필요
# - env: SLACK_WEBHOOK_URL을 Terraform 변수로 주입
########################################
resource "aws_lambda_function" "slack_notifier" {
  function_name = local.full_lambda_name
  role          = aws_iam_role.lambda_role.arn

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  runtime = "nodejs24.x"
  handler = "index.handler"

  # Slack 전송은 네트워크 호출이므로 약간 여유있게
  timeout     = 10
  memory_size = 128

  environment {
    variables = {
      SLACK_WEBHOOK_URL = var.slack_webhook_url
    }
  }
}

########################################
# 5) SNS가 Lambda를 invoke할 수 있도록 permission 허용
# - SNS 서비스가 Lambda 함수를 호출하는 권한 부여
# - source_arn으로 "이 SNS topic"만 허용하도록 제한
########################################
resource "aws_lambda_permission" "allow_sns_invoke" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.slack_notifier.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.gas_alert.arn
}

########################################
# 6) SNS Subscription: protocol=lambda
# - SNS topic에 구독자를 Lambda로 연결
# - permission이 먼저 있어야 정상 동작하므로 depends_on 처리
########################################
resource "aws_sns_topic_subscription" "lambda_sub" {
  topic_arn = aws_sns_topic.gas_alert.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.slack_notifier.arn

  depends_on = [aws_lambda_permission.allow_sns_invoke]
}

########################################
# 7) EC2에서 Node 서버가 SNS Publish 할 수 있도록
#    EC2 Instance Role + Instance Profile 생성
########################################

# EC2가 Assume할 수 있는 Role
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role-${random_string.suffix.result}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# EC2 Role에 붙일 최소 권한 정책
# - Node 앱이 SNS Topic으로 Publish만 할 수 있게 제한
resource "aws_iam_role_policy" "ec2_sns_publish_policy" {
  name = "${var.project_name}-ec2-sns-publish-${random_string.suffix.result}"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["sns:Publish"]
        Resource = aws_sns_topic.gas_alert.arn
      }
    ]
  })
}

# EC2에 attach 가능한 Instance Profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.ec2_instance_profile_name}-${random_string.suffix.result}"
  role = aws_iam_role.ec2_role.name
}