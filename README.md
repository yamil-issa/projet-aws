# Panorama du cloud et deploiement AWS

# Documentation du Projet

## Objectif
Ce projet vise à déployer une infrastructure utilisant Docker Swarm sur AWS EC2 à l'aide de Docker Compose pour la gestion des services, Terraform pour la gestion de l'infrastructure cloud, et Ansible pour la configuration et la gestion des instances EC2.

## Technologies Utilisées
- Docker Compose
- Terraform
- Ansible
- AWS EC2

## Architecture
L'architecture du projet comprend plusieurs composants interconnectés pour automatiser le déploiement et la configuration d'une application distribuée.

### Docker Compose
Docker Compose est utilisé pour définir et gérer les services de l'application dans un environnement Docker Swarm. Voici un extrait du fichier `docker-compose.yml` 

### Terraform 

exécutez `terraform init` puis `terraform apply` pour provisionner l'infrastructure AWS.

### Ansible 

Exécutez `ansible-playbook -i aws_ec2.yml playbook.yml` après avoir configuré votre fichier aws_ec2.yml pour l'inventaire dynamique.

