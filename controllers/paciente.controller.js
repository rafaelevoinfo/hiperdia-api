const { ServerError } = require('../middlewares/handle_error.middleware');
const { firebase_admin } = require('../firebase')
const { Log } = require('../log')
const COLLECTION_NAME = "pacientes";

class AgenteController {

    async salvarPaciente(paciente) {
        Log.logInfo(`Salvando o paciente ${JSON.stringify(paciente)}`);
        if ((!paciente) || (!paciente.nome) || (!paciente.data_nascimento) || (!paciente.sexo)) {
            throw new ServerError("Campos obrigatórios não preenchidos", 400);
        }

        let id = undefined;
        let pacientesCollectionRef = firebase_admin.firestore().collection(COLLECTION_NAME);
        let pacienteRef = null;
        if (paciente.id){
            pacienteRef = pacientesCollectionRef.doc(paciente.id);
        }
        
        if ((!pacienteRef) || (!paciente.id)){        
            let snapshot = await pacientesCollectionRef.where("nome", "==", paciente.nome)
                                                   .where("data_nascimento", "==", paciente.data_nascimento).get();
            if ((snapshot) && (snapshot.docs.length > 0)) {
                pacienteRef = pacientesCollectionRef.doc(paciente.id);
            }                                                
        }

        if ((pacienteRef) && (pacienteRef.exists)){        
            await pacientesCollectionRef.doc(paciente.id).set(paciente);
            id = paciente.id;
        } else {
            let novoPaciente = await pacientesCollectionRef.add(paciente);
            id = novoPaciente.id;
        }

        if (id) {
            return {
                id: id
            };
        } else {
            throw new ServerError("Não foi possível salvar o paciente.", 500);
        }


    }

    async excluirPaciente(id){
        try {
            let pacientesRef = firebase_admin.firestore().collection(COLLECTION_NAME);
            return !!await pacientesRef.doc(id).delete();            
        } catch (error) {
            Log.logError(`Erro ao excluir o paciente. Detalhes: ${error}`);
            throw new ServerError("Não foi possível excluir o paciente.", 500);
        }
    }

    async buscarPacientes(req) {
        let pacientes = [];
        try {
            let pacientesRef = firebase_admin.firestore().collection(COLLECTION_NAME);
            let query = null;
            if (req.query.nome) {
                query = pacientesRef.orderBy("nome")
                    .startAt(req.query.nome)
                    .endAt(req.query.nome + '\uf8ff');
                    
            }
            if (req.query.data_nascimento){
                if (query){
                    query = query.where("data_nascimento", "==", req.query.data_nascimento);
                }else{
                    query = pacientesRef.where("data_nascimento", "==", req.query.data_nascimento);
                }                
            }

            //na pratica nao precisa desse if, mas iria ficar confuso pq são objetos diferentes
            let snapshot = undefined;
            if (query) {
                snapshot = await query.get();
            } else {
                snapshot = await pacientesRef.get();
            }

            snapshot.forEach((doc) => {
                let paciente = this.castDocumentData(doc);
                if (paciente) {
                    pacientes.push(paciente);
                };
            });
            return pacientes;
        } catch (error) {
            Log.logError(`Erro ao buscar os pacientes. Detalhes: ${error}`);
            throw new ServerError("Não foi possível buscar os pacientes.", 500);
        }
    }

    castDocumentData(doc) {
        if (doc && doc.exists) {
            let paciente = doc.data();
            paciente.id = doc.id;
            return paciente;
        }
    }

}

module.exports = AgenteController;