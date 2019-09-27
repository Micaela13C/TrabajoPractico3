var AWS = require('aws-sdk');
var handler = function() {  
    var dynamodb = new AWS.DynamoDB({
            apiVersion: '2012-08-10',
            endpoint: 'http://localhost:8000',
            region: 'us-west-2',
            credentials: {
                accessKeyId: '2345',
                secretAccessKey: '2345'
            }
    });
    var docClient = new AWS.DynamoDB.DocumentClient({
            apiVersion: '2012-08-10',
            service: dynamodb
    });  
    // codigo de la funcion
    var params = {
        TableName: 'envio',
    };
    dynamodb.scan(params, function(err, data) {
        if (err) console.log(JSON.stringify(err)); // an error occurred
        else console.log(JSON.stringify(data)); // successful response
    });
    console.log("funciona")
}
console.log("inicio");
handler();// llamada para testing