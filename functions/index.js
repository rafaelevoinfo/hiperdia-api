const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
require('express-async-errors');
const cors = require('cors');
const {handle_error} = require('./middlewares/handle_error.middleware');

const app = express();

app.use(cors());
app.use(express.json());


const rotasLogin = require('./routers/login.router');
const rotasAgente = require('./routers/agente.router');
const rotasPaciente = require('./routers/paciente.router');
const rotasConsulta = require('./routers/consulta.router');
const rotasRelatorios = require('./routers/relatorio.router');

// console.log(auth);
rotasLogin.addRotas(app);
rotasAgente.addRotas(app);
rotasPaciente.addRotas(app);
rotasConsulta.addRotas(app);
rotasRelatorios.addRotas(app);
app.use(handle_error);

exports.api = functions.https.onRequest(app);
