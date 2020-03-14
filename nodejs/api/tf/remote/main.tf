#USE THIS FILE FOR DEPLOYING LIVE INFRASTRUCTURE
variable "access_key" {
  type        = string
  description = "AWS Access Key ID."
}

variable "secret_key" {
  type        = string
  description = "AWS Secret Key." 
}

provider "aws" {
  access_key                  = var.access_key
  secret_key                  = var.secret_key 
  profile                     = "default"
  region                      = "us-east-1"
  version                     = "~> 2.0"
}