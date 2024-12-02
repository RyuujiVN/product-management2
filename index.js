const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const path = require('path');
require('dotenv').config();

const route = require('./routes/client/route');
const routeAdmin = require('./routes/admin/route');
const database = require('./config/database');

database.connect();

const app = express();
const port = process.env.PORT;

const systemConfig = require("./config/system");


app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use(express.static(`${__dirname}/public`));

// Cookies
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Override method
app.use(methodOverride('_method'));

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening port ${port}`);
})