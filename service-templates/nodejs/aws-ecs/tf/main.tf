variable "access_key" {
  type        = string
  description = "AWS Access Key ID"
}

variable "secret_key" {
  type        = string
  description = "AWS Secret Access Key" 
}

variable "aws_ecr_id" {
  type        = string
  description = "AWS Elastic Container Registry identifier"
  default     = ""
}

provider "aws" {
  access_key                  = var.access_key
  secret_key                  = var.secret_key 
  profile                     = "default"
  region                      = "us-east-1"
  version                     = "~> 2.0"
}

provider "environment" {
  #Custom "utility provider REQUIRED for including local environment variables automatically #injected in Terraform Cloud workers as part of a Terraform configuration.
  #See README.md for more details.
}

data "environment_variable" "git_branch_name" {
  name = "TFC_CONFIGURATION_VERSION_GIT_BRANCH"
  fail_if_empty = true
  normalize_file_path = true
}

data "environment_variable" "git_commit_sha" {
  name = "TFC_CONFIGURATION_VERSION_GIT_COMMIT_SHA"
  fail_if_empty = true
  normalize_file_path = true
}

output "git_branch_name" {
  value = data.environment_variable.git_branch_name.value
}

output "git_commit_sha" {
  value = data.environment_variable.git_commit_sha.value
}

resource "aws_ecs_cluster" "smbs-api" {
  name = "smbs-api"
}

# Configuration for Cloudwatch Logs
resource "aws_cloudwatch_log_group" "smbs-api" {
  name = "/ecs/smbs-api"
}

# ecs.tf
resource "aws_ecs_service" "smbs-api" {
  name            = "smbs-api"
  task_definition = "${aws_ecs_task_definition.smbs-api.family}:${aws_ecs_task_definition.smbs-api.revision}"
  cluster         = "${aws_ecs_cluster.smbs-api.id}"
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
     assign_public_ip = false

    security_groups = [
      "${aws_security_group.egress-all.id}",
      "${aws_security_group.api-ingress.id}",
    ]

    subnets = [
      "${aws_subnet.private.id}"
    ]
  }

  load_balancer {
    target_group_arn = "${aws_lb_target_group.smbs-api.arn}"
    container_name   = "smbs-api"
    container_port   = "8080"
  }
}

# Defines the task that will be running to provide our service. 
# If the service decides it needs more capacity,
# this task definition provides a blueprint for building an identical container.
#
resource "aws_ecs_task_definition" "smbs-api" {
  family = "smbs-api"
  execution_role_arn = "${aws_iam_role.smbs-api-task-execution-role.arn}"

  container_definitions = <<EOF
  [
    {
      "name": "smbs-api",
      "image": "${var.aws_ecr_id}.dkr.ecr.us-east-1.amazonaws.com/simple-microblog-service:${substr(data.environment_variable.git_commit_sha.value, 0, 7)}",
      "portMappings": [
        {
          "containerPort": 8080
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-region": "us-east-1",
          "awslogs-group": "/ecs/smbs-api",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
  EOF

  # These are the minimum values for Fargate containers.
  cpu = 256
  memory = 512
  requires_compatibilities = ["FARGATE"]

  # This is required for Fargate containers.
  network_mode = "awsvpc"
}

resource "aws_lb_target_group" "smbs-api" {
  name = "smbs-api"
  port = 8080
  protocol = "HTTP"
  target_type = "ip"
  vpc_id = "${aws_vpc.app-vpc.id}"

  health_check {
    enabled = true
    path = "/health"
  }

  depends_on = [
    "aws_alb.smbs-api"
  ]
}

resource "aws_alb" "smbs-api" {
  name = "smbs-api-lb"
  internal = false
  load_balancer_type = "application"

  subnets = [
    "${aws_subnet.public.id}",
    "${aws_subnet.private.id}",
  ]

  security_groups = [
    "${aws_security_group.http.id}",
    "${aws_security_group.https.id}",
    "${aws_security_group.egress-all.id}",
  ]

  depends_on = ["aws_internet_gateway.igw"]
}

resource "aws_alb_listener" "smbs-api-http" {
  load_balancer_arn = "${aws_alb.smbs-api.arn}"
  port = "80"
  protocol = "HTTP"

  default_action {
    type = "forward"
    target_group_arn = "${aws_lb_target_group.smbs-api.arn}"
  }
}

output "alb_url" {
  value = "http://${aws_alb.smbs-api.dns_name}"
}

# This is the role under which ECS will execute our task. This role becomes more important
# as we add integrations with other AWS services later on.

# The assume_role_policy field works with the following aws_iam_policy_document to allow
# ECS tasks to assume this role we're creating.
resource "aws_iam_role" "smbs-api-task-execution-role" {
  name = "smbs-api-task-execution-role"
  assume_role_policy = "${data.aws_iam_policy_document.ecs-task-assume-role.json}"
}

data "aws_iam_policy_document" "ecs-task-assume-role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# Normally we'd prefer not to hardcode an ARN in our Terraform, but since this is an AWS-managed
# policy, it's okay.
data "aws_iam_policy" "ecs-task-execution-role" {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Attach the above policy to the execution role.
resource "aws_iam_role_policy_attachment" "ecs-task-execution-role" {
  role = "${aws_iam_role.smbs-api-task-execution-role.name}"
  policy_arn = "${data.aws_iam_policy.ecs-task-execution-role.arn}"
}
  

