const 
    express    = require('express'),
    bodyParser = require('body-parser'),
    cors       = require('cors');


const 
    config = require('../config.js'),
    port   = process.env.PORT || config.app.port;


const app = new express();

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => console.log(`server has been started on port ${port}`));


