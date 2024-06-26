# Panorama du cloud et deploiement AWS

# Documentation du Projet

## Presentaion du projet 

le projet choisi est un task manager en nestJs pour le back end et react pour le front


## Prérequis

- Terraform installé sur votre machine.
- AWS CLI configuré avec les credentials appropriés.
- Une paire de clés SSH générée et accessible sur votre machine locale.
- Docker et Docker Compose installés sur votre machine locale.

## Objectif
Ce projet vise à déployer une infrastructure utilisant Docker Swarm sur AWS EC2 à l'aide de Docker Compose pour la gestion des services, Terraform pour la gestion de l'infrastructure cloud

## Architecture
L'architecture du projet comprend plusieurs composants interconnectés pour automatiser le déploiement et la configuration d'une application distribuée.

### Docker Compose
Docker Compose est utilisé pour définir et gérer les services de l'application dans un environnement Docker Swarm.
- Pour lancer les container : `docker-compose up -d`

### Terraform 

exécutez `terraform init` puis `terraform apply` pour provisionner l'infrastructure AWS.

## 1. Création des Instances EC2 avec Terraform

Utilisez le fichier `main.tf` pour créer les instances EC2. Assurez-vous que les clés SSH sont correctement configurées.

### Étapes :

1. Initialiser Terraform :
    ```bash
    terraform init
    ```

2. Planifier la création des ressources :
    ```bash
    terraform plan
    ```

3. Appliquer la configuration pour créer les ressources :
    ```bash
    terraform apply
    ```

## 2. Connexion aux Instances EC2

Après la création des instances, vous pouvez vous connecter à chacune d'elles via SSH pour effectuer les étapes de déploiement manuel.

### Connexion à l'instance Manager :

```bash
ssh -i ~/.ssh/myKey ec2-user@<manager_public_ip>
```

### Connexion aux instances Worker :

```bash
ssh -i ~/.ssh/myKey ec2-user@<worker1_public_ip>
ssh -i ~/.ssh/myKey ec2-user@<worker2_public_ip>
```

3. Initialiser un Swarm Docker 

Sur l'instance Manager, initialisez le Docker Swarm :

```bash
sudo docker swarm init --advertise-addr <manager_public_ip>
```

Notez la commande join qui sera affichée, vous en aurez besoin pour les workers.

4. Joindre les Workers au Swarm

Sur chaque instance Worker, exécutez la commande join (remplacez par celle fournie par l'init de Swarm) :

```bash
sudo docker swarm join --token <swarm_token> <manager_public_ip>:2377
```

5. Copie des Dossiers front et back

Sur votre machine locale, copiez les dossiers front et back sur l'instance Manager :

```bash
scp -i ~/.ssh/myKey -r ./front ec2-user@<manager_public_ip>:~
scp -i ~/.ssh/myKey -r ./back ec2-user@<manager_public_ip>:~
```

### 3. Déploiement de l'Application avec Docker Compose

- Sur l'instance Manager, copier le fichier docker-compose.yml avec le contenu fourni :

```bash
scp -i ~/.ssh/myKey ./docker-compose.yml ec2-user@<manager_public_ip>:~
```

- Déployer les services :

```bash
sudo docker stack deploy -c docker-compose.yml my_stack
```

### 4. Conclusion
Le projet est maintenant déployé sur un cluster Docker Swarm sur des instances EC2. Vous pouvez accéder à l'application via l'adresse IP publique de l'instance Manager sur les ports spécifiés (80 pour le frontend, 3000 pour le backend).