# Lambda AWS /cards/{id} Endpoint for the Controversies of Science

This serverless JSON endpoint provides access to a MongoDB cards collection hosted on mLab.  This endpoint will be used to serve data to React frontend app at https://github.com/worldviewer/react-worldviewer-prototype.

To test, go to:

    https://czlxg9sj34.execute-api.us-east-1.amazonaws.com/dev/cards/58b8f1f7b2ef4ddae2fb8b17

## Setting up an mLab Backend

At this current stage, we have a very simple backend.  So, my tech stack will bias towards ease-of-deployment and, for now, zero cost.  I was a little bit drawn by the sophistication of the Strongloop toolset, but for now I'm going with AWS Lambda using the Serverless API.  It's simple and free.

The first step is to set up an account at mLab and create a new deployment that is Single-node, Standard Line Sandbox.  Name the db:

    controversiesofscience

Pay close attention to the MongoDB version which mLab is hosting.  This must match your own local db version.  For my install, mLab is using 3.2.x.  So, I had to revert my own local MongoDB version with homebrew, as follows ...

    brew install homebrew/versions/mongodb32

... then ...

    brew unlink mongodb
    brew link --overwrite mongodb32

I found that the prior data was still there, so it was not necessary to re-scrape.  But I did just in case.

You can now click the button at mLab for `Create new MongoDB deployment`.

The next step is to transfer the db to mLab, first with export from the local ...

    mongoexport -h localhost:27017 -d controversies -c cards -o cards.db

    mongoexport -h localhost:27017 -d controversies -c metacards -o metacards.db

Make sure to attach a user login and password to the database on mLab.

... and then import into the remote ...

    mongoimport -h ds023550.mlab.com:23550 -d controversiesofscience -c metacards -u <user> -p <password> --file metacards.db

    mongoimport -h ds023550.mlab.com:23550 -d controversiesofscience -c cards -u <user> -p <password> --file cards.db

Now, to connect to the db on mLab ...

    mongodb://<dbuser>:<dbpassword>@ds023550.mlab.com:23550/controversiesofscience

## Setting up the Lambda AWS API Gateway

To install the Serverless CLI:

    npm install -g serverless

Then, scaffold the project:

    sls create --template aws-nodejs

Add from the package.json directory, install the node_modules ...

    npm install

The code expects an environment variable MLABDB to be set.  This should contain the mLab database connection info with login and password embedded into the request.  It's encoded into an encrypted yaml file:

    MLABDB: mongodb://<dbuser>:<dbpassword>@ds023550.mlab.com:23550/controversiesofscience

Instructions for setting up babel with Serverless ...

    http://serverless-stack.com/chapters/add-support-for-es6-javascript.html?utm_source=stackoverflow.com

When the service is not working, get the logs with:

    sls logs -f cardsGet

To deploy to AWS Lambda ...

    sls deploy --stage dev

In order to deploy, the secret has to first be decrypted ...

    serverless decrypt --stage dev --password '<password>'

In order to commit code, the secret has to be encrypted ...

    serverless encrypt --stage dev --password '<password>'
