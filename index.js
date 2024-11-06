const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
require('dotenv').config();

const route = require('./routes/client/route');
const routeAdmin = require('./routes/admin/route');
const database = require('./config/database');

database.connect();

const app = express();
const port = process.env.PORT;

const systemConfig = require("./config/system");


app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Override method
app.use(methodOverride('_method'));

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening port ${port}`);
})