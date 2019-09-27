var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  endpoint: 'http://dynamodb:8000',
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
var handler = function(event, context, callback) {


  let envio = JSON.parse(event.body) || false;

  switch (event.httpMethod) {
    
    case "GET":
      if (event.resource == '/envios/pendientes') {
        const params = {
          TableName: 'envio',
          IndexName: 'envios_pendientes_index'
        };
        dynamodb.scan(params, function(err, data) {
          if (err) callback(null, { body: err });
          else callback(null, { body: JSON.stringify(data.Items) });
        });
      } else {
        const idEnvio = event.pathParameters.idEnvio;
        if (idEnvio) {
            var params = {
              TableName: "envio",
              KeyConditionExpression: "id = :id",
              ExpressionAttributeValues: {
                ":id": idEnvio
              }
            };
            docClient.query(params).eachPage(function(err, data) {
              if (err) callback(null, { body: err });
              else if (data)
                callback(null, { body: JSON.stringify(data.Items[0]) }); // successful response
            });
          }
        }
        break;
    case "POST":
      if (event.resource == "/envios/{idEnvio}/entregado") {
        const idEnvio = event.pathParameters.idEnvio;
        var params = {
          TableName: "envio",
          Key: {
            id: idEnvio
          },
          UpdateExpression: "remove pendiente",
          ReturnValues: "ALL_NEW"
        };
        docClient.update(params, function(err, data) {
          if (err) callback(null, { body: err });
          // an error occurred
          else callback(null, { body: data.Attributes.id + " Se ha entregado" }); // successful response
        });
      } else {
        var params = {
          TableName: "envio",
          Item: {
            id: JSON.parse(event.body).id,
            fechaAlta: Date().toString(),
            destino: JSON.parse(event.body).destino,
            email: JSON.parse(event.body).email,
            pendiente: JSON.parse(event.body).pendiente
          }
        };
        docClient.put(params, function(err, data) {
          if (err) callback(null, { body: err });
          // an error occurred
          else callback(null, { body: params.Item.id }); // successful response
        });
      }
      break;
    default:
      callback(null, {
        body: "empty"
      });
  }
};
exports.handler = handler;