require('dotenv').config();

const express = require('express');
require('express-async-errors');
const {auth} = require('./firebase')
const cors = require('cors')
const {handle_error} = require('./middlewares/handle_error.middleware')

const app = express();

app.use(cors());
app.use(express.json());


const rotasLogin = require('./routers/login.router')
const rotasAgente = require('./routers/agente.router')

// console.log(auth);
//app.use(require('./middlewares/auth.middleware'))
rotasLogin.addRotasLogin(app, auth);
rotasAgente.addRotas(app, auth);

app.use(handle_error);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080, () => {
    console.log(`Iniciado na porta ${process.env.PORT||8080}`);
});