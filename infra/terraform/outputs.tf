########################################
# Terraform Outputs
# - apply 후 콘솔/CI에서 참조할 값들
# - 특히 sns_topic_arn은 Node 서비스의 .env에 넣어야 함
########################################

output "sns_topic_arn" {
  description = "OutboxPublisher가 publish할 SNS Topic ARN"
  value       = aws_sns_topic.gas_alert.arn
}

output "sns_topic_name" {
  description = "생성된 SNS Topic 이름"
  value       = aws_sns_topic.gas_alert.name
}

output "lambda_arn" {
  description = "SNS가 트리거하는 Lambda ARN"
  value       = aws_lambda_function.slack_notifier.arn
}

output "lambda_name" {
  description = "생성된 Lambda 함수 이름"
  value       = aws_lambda_function.slack_notifier.function_name
}

output "ec2_instance_profile_name" {
  description = "EC2에 부착할 Instance Profile 이름"
  value       = aws_iam_instance_profile.ec2_profile.name
}