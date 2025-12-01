const express = require('express')
const path = require('path')
require('dotenv').config();
const database = require("./config/database")
const adminRoute = require('./routers/admin/index.route');
const clientRouter = require('./routers/client/index.route');
const variableConfig = require("./config/variable")
const cookieParser = require('cookie-parser');
const flash = require('express-flash')
const session = require('express-session')

const app = express()
const port = 3000

database.connect();


//thiet lap views
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

//thiet lap file tinh
app.use(express.static(path.join(__dirname, "public")));

// CORS Demo - Serve static CORS demo files
app.use('/cors-demo', express.static(path.join(__dirname, "security-demo/cors/vulnerable-site")));

//tao bien toan cuc trong pug
app.locals.pathadmin = variableConfig.pathadmin;

//tao bien toan cuc trong file backend
global.pathadmin = variableConfig.pathadmin;

//cho phep gui data len dang json
app.use(express.json());
app.use(cookieParser("hoan322004"));


//nhung flash
app.use(session({ cookie: { maxage: 60000 }}))
app.use(flash());

app.use(`/${variableConfig.pathadmin}`, adminRoute);
app.use('/', clientRouter);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})