const fs = require('fs');
const express = require('express');
const Cache = require('node-cache');
const cors = require('cors');

const keybaseClient = require('./keybase-client');

const CHANNEL = 'grincoin#general';
const HTTP_PORT = process.env.HTTP_PORT;
const app = express().set('json spaces', 2);
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

app.listen(HTTP_PORT ,() => {
  console.log(`[info]: Starting http server on: ${HTTP_PORT}`);
});
