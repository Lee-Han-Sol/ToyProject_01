########################################
# Terraform 입력 변수 모음
# - 팀/환경/비밀값을 코드에 박지 않고, apply 시 주입하거나
#   tfvars / 환경변수로 관리하기 위함
########################################

# AWS 리전 (서울 리전 기본)
variable "aws_region" {
  type    = string
  default = "ap-northeast-2"
}

# 리소스 이름에 붙일 프로젝트 식별자(네이밍 통일)
variable "project_name" {
  type    = string
  default = "gas-monitor"
}

# Slack Incoming Webhook URL (민감정보이므로 env로 관리)
# terraform apply 할 때 -var로 주입하는 방식 권장
variable "slack_webhook_url" {
  type        = string
  sensitive   = true
  description = "Slack Incoming Webhook URL"
}

# SNS Topic 기본 이름 (충돌 방지를 위해 main.tf에서 suffix 붙임)
variable "sns_topic_name" {
  type    = string
  default = "gas-alert-topic-dev"
}

# Lambda 함수 기본 이름 (충돌 방지를 위해 main.tf에서 suffix 붙임)
variable "lambda_function_name" {
  type    = string
  default = "gas-alert-to-slack-dev"
}

# EC2에 부착할 Instance Profile 기본 이름
variable "ec2_instance_profile_name" {
  type    = string
  default = "gas-monitor-ec2-profile"
}