variable "aws_region" {
  description = "The AWS region to create resources in."
  default     = "eu-west-3"
}

variable "instance_type" {
  description = "The EC2 instance type"
  default     = "t2.micro"
}
