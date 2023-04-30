require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./api/routes/apiRouter');
const apiRouterV2 = require('./api/routes/apiRouter-v2');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', apiRouter);
app.use('/api/v2', apiRouterV2);

let port = process.env.PORT || 3000
app.listen (port)
