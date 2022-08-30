const jwt = require("jsonwebtoken");
const { Log, LogLevel } = require('../log')
const firebase_admin  = require('firebase-admin');

class LoginController {
  
  async login(ipBody) {
    let vaResult = {
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
        snapshot.forEach((doc) => {
          if (doc && doc.exists) {
            let agente = doc.data();
            if (agente.senha === senha) {

              vaResult.auth = true;
              vaResult.token = jwt.sign({"login": login,
                                         "perfil": agente.perfil},
                                         process.env.SECRET, 
                                        {expiresIn: 86400 });// expires in 1 day                                
            }
          }
        });
      }
    } catch (error) {
      Log.logError(error);
    }

    return vaResult;
  }
}

module.exports = LoginController;
