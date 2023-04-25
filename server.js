require('dotenv').config();

const domain = 'leonardo.vps.webdock.cloud';
const express = require('express');
const https = require('https');
const fs = require('fs');
const options = {
    key: fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${domain}/fullchain.pem`)
};
const cors = require('cors');
const path = require('path');
const apiRouter = require('./api/routes/apiRouter');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter);

https.createServer(options, app).listen(8000)