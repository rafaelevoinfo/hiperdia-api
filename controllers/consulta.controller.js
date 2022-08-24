const { ServerError } = require('../middlewares/handle_error.middleware');
const { firebase_admin } = require('../firebase')
const { Log } = require('../log')
const COLLECTION_NAME = "consultas";

class ConsultaController {

    async salvar(consulta) {
        Log.logInfo(`Salvando a consulta ${JSON.stringify(consulta)}`);
        if ((!consulta) || (!consulta.id_paciente) || (!consulta.data)) {
            throw new ServerError("Campos obrigatórios não preenchidos", 400);
        }

        let id = undefined;
        let consultasCollectionRef = firebase_admin.firestore().collection(COLLECTION_NAME);
        let consultaRef = null;
        if (consulta.id) {
            consultaRef = consultasCollectionRef.doc(consulta.id);
        }

        if ((consultaRef) && (consultaRef.exists)) {
            await consultasCollectionRef.doc(consulta.id).set(consulta);
            id = consulta.id;
        } else {
            let novaConsulta = await consultasCollectionRef.add(consulta);
            id = novaConsulta.id;
        }

        if (id) {
            return {
                id: id
            };
        } else {
            throw new ServerError("Não foi possível salvar a consulta.", 500);
        }


    }

    async excluir(id) {
        try {
            let consultasRef = firebase_admin.firestore().collection(COLLECTION_NAME);
            return !!await consultasRef.doc(id).delete();
        } catch (error) {
            Log.logError(`Erro ao excluir a consulta. Detalhes: ${error}`);
            throw new ServerError("Não foi possível excluir a consulta.", 500);
        }
    }

    async buscar(req) {
        let consultas = [];
        try {
            let consultasRef = firebase_admin.firestore().collection(COLLECTION_NAME);
            let query = consultasRef.where("id_paciente", "==", req.query.id_paciente);

            if (req.query.data) {
                query = query.where("data", "==", req.query.data);
            }

            let snapshot = await query.get();            
            snapshot.forEach((doc) => {
                let consulta = this.castDocumentData(doc);
                if (consulta) {
                    consultas.push(consulta);
                };
            });
            return consultas;
        } catch (error) {
            Log.logError(`Erro ao buscar as consultas. Detalhes: ${error}`);
            throw new ServerError("Não foi possível buscar as consultas.", 500);
        }
    }

    castDocumentData(doc) {
        if (doc && doc.exists) {
            let consulta = doc.data();
            consulta.id = doc.id;
            return consulta;
        }
    }

}

module.exports = ConsultaController;