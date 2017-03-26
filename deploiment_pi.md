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

## Passage a psql
```
sudo apt-get install php5-pgsql

sudo apt-get install postgresql
```

## Définition dumot de passe de postgres
```
sudo -u postgres psql postgres

\password postgres

\q
```

## Création de la db
```
sudo -u postgres createdb bigData
```

## Démmarge de postgres
```
sudo /etc/init.d/postgresql start
```

## Récupération des dump de la bdd
```
sudo -E curl -L http://78.218.16.117:8080/db/dump_bigdata_2017-03-19_ban-siren.sql >> dump_ban-siren.sql

sudo -E curl -L http://78.218.16.117:8080/db/dump_bigdata_2017-03-19_ban-siren_data.sql >> dump_ban-siren_data.sql

sudo -E curl -L http://78.218.16.117:8080/db/dump_bigdata_2017-03-19_ban-siren_struct.sql >> dump_ban-siren_struct.sql


```

## Installtion postgis
```
sudo apt-get install postgresql-9.4-postgis-2.1
```

## Création de l'extension postgis
```
sudo -u postgres bigData

CREATE EXTENSION postgis;;
```

## Import des dump
```
sudo -u postgres psql bigData < dump_ban-siren_struct.sql

sudo -u postgres psql bigData < dump_ban-siren_data.sql

sudo -u postgres psql bigData < dump_ban-siren.sql
```

## Changement du serveur dans monscript.js et de connexion.inc.php
