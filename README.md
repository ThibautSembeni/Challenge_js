# Challenge_js

## Démarrer le projet avec Docker Compose

Avant de démarrer le projet avec Docker Compose, assurez-vous d'avoir suivi ces étapes préliminaires :

1. Générez un fichier `file.key` à la racine du projet en utilisant la commande suivante :

   ```bash
   openssl rand -base64 756 > file.key
   ```

   Cette commande générera un fichier `file.key` contenant 756 octets de données aléatoires en base64. Assurez-vous de garder ce fichier en sécurité, car il peut être utilisé pour des opérations sensibles.

2. Accordez les droits appropriés au fichier `file.key` pour des raisons de sécurité en exécutant la commande :

   ```bash
   chmod 400 file.key
   ```

   Cela donnera uniquement des droits de lecture au propriétaire du fichier et aucun droit aux autres utilisateurs.

Maintenant que vous avez préparé le fichier `file.key`, vous pouvez démarrer le projet en utilisant Docker Compose avec la commande suivante :

```bash
docker-compose up -d
```

Cela lancera les services spécifiés dans le fichier `docker-compose.yml` en mode détaché (arrière-plan). Assurez-vous d'avoir Docker Compose installé et configuré correctement sur votre système avant d'exécuter cette commande.

Assurez-vous également que le fichier `file.key` est présent à la racine du projet et qu'il est correctement configuré pour les services Docker qui en ont besoin.

## Exécution du script de configuration après le démarrage de docker

Après avoir démarré Docker Compose avec succès, vous pouvez exécuter le script de configuration `setup.sh` dans le conteneur MongoDB en utilisant la commande `docker-compose exec`.

Assurez-vous que Docker Compose est en cours d'exécution (si ce n'est pas le cas, exécutez `docker-compose up -d` comme indiqué précédemment).

Exécutez la commande suivante pour lancer le script `setup.sh` dans le conteneur MongoDB :

```bash
docker-compose exec mongodb bash data/setup.sh
```

Cela permettra d'exécuter le script `setup.sh` situé dans le répertoire `data` à l'intérieur du conteneur MongoDB. Assurez-vous que le script est correctement configuré et qu'il ne nécessite pas d'interactions supplémentaires lors de son exécution.

Après avoir exécuté le script de configuration, votre projet devrait être correctement configuré et prêt à être utilisé avec les services Docker que vous avez spécifiés dans votre fichier `docker-compose.yml`.
