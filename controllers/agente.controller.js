const { ServerError } = require('../middlewares/handle_error.middleware');
const { firebase_admin } = require('../firebase')
const { Log } = require('../log')
const COLLECTION_NAME = "agentes";

class AgenteController {

    async salvarAgente(agente) {
        Log.logInfo(`Salvando o agente ${JSON.stringify(agente)}`);
        if ((!agente) || (!agente.login) || (!agente.senha) || (!agente.nome)) {
            throw new ServerError("Dados inválidos", 400);
        }
        if (!agente.perfil) {
            agente.perfil = 0;
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

            await agentesCollectionRef.doc(agente.id).set(agente);
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
            agente.id = doc.id;
            return agente;
        }
    }

}

module.exports = AgenteController;