const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`COS143 API: Port ${port}`))
app.use(express.json())
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('./'))

require('./apiRoutes')(app);
