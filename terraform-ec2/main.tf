provider "aws" {
  region = "eu-west-3"
}

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH inbound traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "my_key" {
  key_name   = "myKey"
  public_key = file("~/.ssh/myKey.pub")
}

resource "aws_instance" "manager" {
  ami           = "ami-07bc135c11aeb2d65"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.my_key.key_name

  tags = {
    Name = "swarm-manager"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      "sudo yum install docker -y",
      "sudo systemctl start docker",
      "sudo systemctl enable docker"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("~/.ssh/myKey")
      host        = self.public_ip
    }
  }

  provisioner "local-exec" {
    command = <<EOT
      jq -n --argjson manager_ip "$(terraform output -json manager_public_ip)" \
            --argjson worker1_ip "$(terraform output -json worker1_public_ip)" \
            --argjson worker2_ip "$(terraform output -json worker2_public_ip)" \
            '{manager: $manager_ip, worker1: $worker1_ip, worker2: $worker2_ip}' > inventory.json
    EOT
  }
}

resource "aws_instance" "worker1" {
  ami           = "ami-07bc135c11aeb2d65"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.my_key.key_name

  tags = {
    Name = "swarm-worker1"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      "sudo yum install docker -y",
      "sudo systemctl start docker",
      "sudo systemctl enable docker"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("~/.ssh/myKey")
      host        = self.public_ip
    }
  }
}

resource "aws_instance" "worker2" {
  ami           = "ami-07bc135c11aeb2d65"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.my_key.key_name

  tags = {
    Name = "swarm-worker2"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      "sudo yum install docker -y",
      "sudo systemctl start docker",
      "sudo systemctl enable docker"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("~/.ssh/myKey")
      host        = self.public_ip
    }
  }
}
