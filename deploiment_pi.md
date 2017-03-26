# Déploiement sur les RPI

## Mise à jour du système
```
sudo apt-get update && sudo apt-get -y upgrade && sudo apt-get -y dist-upgrade
```

## Installation du serveur apapche
```
sudo apt-get install apache2 -y
```

## Sur la rpi récupération du dossier de travail
```
 git clone https://github.com/rmaziere/GraphAnnoncActivity.git
```

## Copie de l'index dans /var/www/html/
```
sudo cp website/index.html /var/www/html
```

## Test du déploiement
Allez sur [http://212.194.0.132:482/](http://212.194.0.132:482/)

## Installation des différents paquets
```
sudo apt-get install php5 mysql-server phpmyadmin
```

## Configuration de mysql-server-5.5
```
Nouveau mot de passe du superutilisateur de MySQL : Password

Confirmation du mot de passe du superutilisateur de MySQL : Password
```

## Configuration de phpmyadmin
```
Serveur web à reconfigurer automatiquement : apache2

Faut-il configurer la base de données de phpmyadmin avec dbconfig-common ? : Oui

Mot de passe de l'administrateur de la base de données : Password

Mettez le même mot de passe que celui de la configuration Mysql-server

Mot de passe de connexion MySQL pour phpmyadmin : Password
```