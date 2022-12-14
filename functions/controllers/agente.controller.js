const { ServerError } = require('../middlewares/handle_error.middleware');
const firebase_admin  = require('firebase-admin');
const { Log } = require('../log')
const {criptografar} = require("./utils.js");
const COLLECTION_NAME = "agentes";


class AgenteController {

    async salvarAgente(agente) {        
        if (((!agente) || (!agente.login) || (!agente.nome)) || 
            ((!agente.id) && (!agente.senha))) {
            throw new ServerError("Dados inválidos", 400);
        }
        if (!agente.perfil) {
            agente.perfil = 0;
        }
        
        if (agente.senha){
            agente.senha = criptografar(agente.senha)
        }

        let id = undefined;
        let agentesCollectionRef = firebase_admin.firestore().collection(COLLECTION_NAME);
        let snapshot = await agentesCollectionRef.where("login", "==", agente.login).get();
        if ((snapshot) && (snapshot.docs.length > 0)) {
            snapshot.forEach((doc) => {
                if (doc.id != agente.id) {
                    throw new ServerError("Já existe um agente cadastrado para este login", 400);
                }
            })
            if (!agente.senha){
                delete agente.senha
            }
            if (process.env.DEBUG){
                Log.logInfo(`Salvando o agente ${JSON.stringify(agente)}`);
            }            
            await agentesCollectionRef.doc(agente.id).set(agente, {merge:true});
            id = agente.id;            
        } else {
            let agenteBd = await agentesCollectionRef.add(agente);
            id = agenteBd.id;
        }

        if (id) {
            return {
                id: id
            };
        } else {
            throw new ServerError("Não foi possível salvar o agente.", 500);
        }


    }

    async excluirAgente(id){
        try {
            let agentesRef = firebase_admin.firestore().collection(COLLECTION_NAME);
            return !!await agentesRef.doc(id).delete();            
        } catch (error) {
            Log.logError(`Erro ao excluir o agente. Detalhes: ${error}`);
            throw new ServerError("Não foi possível excluir o agente.", 500);
        }
    }

    async buscarAgente(id){
        try {
            let doc = await firebase_admin.firestore().collection(COLLECTION_NAME).doc(id).get();
            return this.castDocumentData(doc)
        } catch (error) {
            Log.logError(`Erro ao buscar um agente. Detalhes: ${error}`);
            throw new ServerError("Não foi possível busca o agente.", 500);
        } 
    }

    async buscarAgentes(req) {
        let agentes = [];
        try {
            let agentesRef = firebase_admin.firestore().collection(COLLECTION_NAME);
            let query = undefined;
            if (req.query.nome) {
                query = agentesRef.orderBy("nome")
                    .startAt(req.query.nome)
                    .endAt(req.query.nome + '\uf8ff');
            }
            //na pratica nao precisa desse if, mas iria ficar confuso pq são objetos diferentes
            let snapshot = undefined;
            if (query) {
                snapshot = await query.get();
            } else {
                snapshot = await agentesRef.get();
            }

            snapshot.forEach((doc) => {
                let agente = this.castDocumentData(doc);
                if (agente) {
                    agentes.push(agente);
                };
            });
            return agentes;
        } catch (error) {
            Log.logError(`Erro ao buscar os agentes. Detalhes: ${error}`);
            throw new ServerError("Não foi possível buscar os agentes.", 500);
        }
    }

    castDocumentData(doc) {
        if (doc && doc.exists) {
            let agente = doc.data();
            agente.senha = undefined;//nunca queremos retornar a senha
            agente.id = doc.id;
            return agente;
        }
    }

}

module.exports = AgenteController;