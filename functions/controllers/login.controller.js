const jwt = require("jsonwebtoken");
const { Log, LogLevel } = require('../log')
const firebase_admin = require('firebase-admin');
const AgenteController = require("./agente.controller");
const {criptografar} = require("./utils.js");

class LoginController {

  criarToken(agente) {
    return jwt.sign({
                      "login": agente.login,
                      "perfil": agente.perfil
                    },
                    process.env.SECRET,
                    { 
                      expiresIn: 86400 // expires in 1 day
                    });
  }

  async login(ipBody) {
    let result = {
      auth: false,
      token: "",
    };
    try {
      if (process.env.DEBUG) {
        console.log(ipBody);
      }
      let { login, senha } = ipBody;

      if (login && senha) {
        /*let agentesRef = this.firestore.collection(this.firestore.getFirestore(),"agentes")
        let query = this.firestore.query(agentesRef, this.firestore.where("login", "==", "admin"));
        let snapshot = await this.firestore.getDocs(query);*/
        let snapshot = await firebase_admin.firestore().collection("agentes").where("login", "==", login).get();
        if ((login == "admin") && (snapshot.size == 0)) {
          let agente = {
            login: 'admin',
            senha: 'admin',
            perfil:1,
            nome: 'Administrador'
          }

          let agenteController = new AgenteController();
          await agenteController.salvarAgente(agente);
          result.auth = true;
          result.token = this.criarToken(agente);
        } else {
          snapshot.forEach((doc) => {
            if (doc && doc.exists) {
              let agente = doc.data();
              let senhaCripto = criptografar(senha);
              if (agente.senha === senhaCripto) {
                result.auth = true;
                result.token = this.criarToken(agente);
              }
            }
          });
        }
      }
    } catch (error) {
      Log.logError(error);
    }

    return result;
  }
}

module.exports = LoginController;
