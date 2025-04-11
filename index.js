const express = require('express')
const path = require('path')
require('dotenv').config();
const database = require("./config/database")
const adminRoute = require('./routers/admin/index.route');
const clientRouter = require('./routers/client/index.route');
const variableConfig = require("./config/variable")
const cookieParser = require('cookie-parser');


const app = express()
const port = 3001

database.connect();


//thiet lap views
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

//thiet lap file tinh
app.use(express.static(path.join(__dirname, "public")));

//tao bien toan cuc trong pug
app.locals.pathadmin = variableConfig.pathadmin;

//tao bien toan cuc trong file backend
global.pathadmin = variableConfig.pathadmin;

//cho phep gui data len dang json
app.use(express.json());

//su dung cookie-parser
app.use(cookieParser());

app.use(`/${variableConfig.pathadmin}`, adminRoute);
app.use('/', clientRouter);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})