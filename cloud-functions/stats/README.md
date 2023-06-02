## Stats cloud function
This function updates the stats collection when one of the likes or dislikes collection deletes or creates a row.

### Deploy
Create a compressed version:

```bash
docker run --rm --interactive --tty --volume $PWD:/usr/code openruntimes/node:v2-18.0 sh /usr/local/src/build.sh
```

Submit the tar.gz file to the deployment tool of appwrite cloud.

### Function setup in appwrite
Create a new function and connected to the events:

```
databases.tinto.collections.likes.documents.*
databases.tinto.collections.dislikes.documents.*
```

Create a `stats` table with the columns:


- *wine_id (string)
- *type (string)
- likes (integer) default 0
- dislikes (integer) default: 0

And add a unique key for `wine_id` and `type`