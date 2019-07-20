'use strict';

const dotenvLoad = require('dotenv-load');
dotenvLoad();
const path = require('path');
const express = require('express');
const https = require('https');

const app = express();
const AzureKey = process.env.AZURE_KEY;
const staticPath = path.join(__dirname, '/');


function useAzureApi(req, res) {
    const host = 'api.cognitive.microsoft.com';
    const path = '/bing/v7.0/images/search';
    const request_params = {
        method: 'GET',
        hostname: host,
        path: path + '?q=' + encodeURIComponent(req.query.q),
        headers: {
            'Ocp-Apim-Subscription-Key': AzureKey,
        }
    };

    const request = https.get(request_params, (response) => {
        let data = '';
        response.on('data', (d) => {
            data += d;
        }
        )
        response.on('end', () => {
            data = JSON.parse(data);
            res.send(JSON.stringify(data.value));
        }
        )
    });
    request.end();
};

app.use(express.static(staticPath));

// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
    console.log('listening');
});

app.get("/search", useAzureApi)