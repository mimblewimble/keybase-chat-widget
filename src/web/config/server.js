const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const Cache = require('node-cache');
const cors = require('cors');

const keybaseClient = require('./keybase-client');

const CHANNEL = 'grincoin#general';
const HTTP_PORT = process.env.HTTP_PORT || 8080;
const HTTPS_PORT = process.env.HTTPS_PORT;
const privkey = fs.readFileSync(process.env.PRIVKEY_PATH);
const fullchain = fs.readFileSync(process.env.FULLCHAIN_PATH);
const credentials = {
  key: privkey,
  cert: fullchain,
};
const app = express().set('json spaces', 2);
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
const cache = new Cache();

function midCache(key, duration) {
  return (req, res, next) => {
    const value = cache.get(key);

    if (value) {
      res.json(value);
    } else {
      res.__json = res.json;
      res.json = (body) => {
        cache.set(key, body, duration);
        res.__json(body);
      };

      next();
    }
  };
}

app.get('/messages', cors(), midCache(CHANNEL, 3), (req, res) => {
  keybaseClient.readMessages().then(messages => {
    res.json(messages);
  });
});

app.get('/team', cors(), midCache('grincoin.public', 86400), (req, res) => {
  keybaseClient.getTeam().then(messages => {
    res.json(messages);
  });
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`[info]: Starting http server on: ${HTTP_PORT}`);
});
if (HTTPS_PORT) {
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`[info]: Starting https server on: ${HTTPS_PORT}`);
  });
}
