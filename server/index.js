const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/auth', routes.auth);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});