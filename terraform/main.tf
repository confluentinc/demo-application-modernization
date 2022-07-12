terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "4.21.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

resource "aws_default_vpc" "default_vpc" {
    tags = {
        name = "Default VPC"
    }
}
resource "aws_security_group" "postgres_sg" {
    name = "app_mod_postgres_security_group"
    description = "Security Group for Postgres EC2 instance. Used in Confluent Cloud Application Modernization demo."
    vpc_id = aws_default_vpc.default_vpc.id
    egress {
        description = "Allow all outbound."
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = [ "0.0.0.0/0" ]
    }
    ingress {
        description = "Postgres"
        from_port = 5432
        to_port = 5432
        protocol = "tcp"
        cidr_blocks = [ "0.0.0.0/0" ]
    }
    ingress {
        description = "Postgres"
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = [ "0.0.0.0/0" ]
    }
    tags = {
        Name = "app-mod-postgres-sg"
        created_by = "terraform"
    }
}
data "template_cloudinit_config" "pg_bootstrap" {
    base64_encode = true
    part {
        content_type = "text/x-shellscript"
        content = "${file("scripts/pg_commands.sh")}"
    }
}
resource "aws_instance" "postgres" {
    ami = "ami-08546f4ffb2306647"
    instance_type = "t2.micro"
    associate_public_ip_address = true
    security_groups = [aws_security_group.postgres_sg.name]
    user_data = "${data.template_cloudinit_config.pg_bootstrap.rendered}"
    tags = {
        Name = "app-mod-postgres-instance"
        created_by = "terraform"
    }
}
output "postgres_instance_public_endpoint" {
    value = aws_instance.postgres.public_ip
}
