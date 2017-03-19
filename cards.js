if (!global._babelPolyfill) {
    require('babel-polyfill');
}

let MongoClient = require('mongodb').MongoClient;

const 
    CARDS = 'cards';

module.exports.get = (event, context, callback) => {
    MongoClient.connect(process.env.MLABDB, (connectError, db) => {
        if (connectError) { throw connectError; }

        db.collection(CARDS)
            .find({"_id": event.pathParameters.id})
            .toArray((queryError, docs) => {

            if (queryError) {
                console.error(queryError);
                callback(new Error('Couldn\'t fetch the card data.'));
            } else {
                const response = {
                    statusCode: 200,
                    body: docs
                };

                callback(null, response);
            }

            db.close();
            context.done();
        });
    });
};
