# Start the server on dev env
# Start watcher and run the server in ./dist
```bash
    $ yarn watch
    $ yarn dev-server
```

# MongoDB + Session + Connect-Mongo
## Create a MongoStore Session synchronius to MongoDB Cloud
- Once we connect to the MongoDB Cloud and use the MongoStore+Session
- Everytime we create cookie => Connect-Mongo will create a record and upload to the cloud. ( It's easy to manage the authentication and sessions )
- Once we logout. We remove cookies session on server => data on cloud will be remove also.
- Beside that, when session timeout. Request.Session will be destroy and cloud is same.

## Helping
https://stackoverflow.com/questions/66982720/keep-running-into-the-same-deployment-error-exec-format-error-when-pushing-nod

## Failed to push image to web
Apple M1 does not support the forcing of different platforms.

```bash
### replace signingv2 with your own tag
docker buildx build --platform linux/amd64 -t signingv2 .

### make sure to use the name of your Heroku app
docker tag signingv2 registry.heroku.com/signingv2/web

### use docker push to push it to the Heroku registry
docker push registry.heroku.com/signingv2/web

### then use heroku release to activate
heroku container:release web -a signingv2
```