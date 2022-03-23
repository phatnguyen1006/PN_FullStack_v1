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
