"use strict"

/* create api */  

const region = 'ap-southeast-1';
const endpoint = 'dynamodb.ap-southeast-1.amazonaws.com';

const api = require('@sglearn/web-server')

const DatabaseAbstractor = require("database-abstractor")
const catalog = new DatabaseAbstractor();
const course = new DatabaseAbstractor();
const enroll = new DatabaseAbstractor();

catalog.use(require('@sglearn/catalogdb-dynamodb-driver')({region, endpoint}));
course.use(require('@sglearn/coursedb-dynamodb-driver')({region, endpoint}));
enroll.use(require('@sglearn/enrolldb-dynamodb-driver')({region, endpoint}));

api.useDatabase({ catalog, course, enroll })

/* create express app from api */  
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express();

app.use(cors());
app.use(cookieParser())

app.use('/', api);

/* wrap into lambda */  
const awsServerlessExpress = require('aws-serverless-express')
const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}
