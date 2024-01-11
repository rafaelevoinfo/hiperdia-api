const { ServerError } = require('../middlewares/handle_error.middleware');
const firebase_admin = require('firebase-admin');
const firestore = require('firebase-admin/firestore')
const { Log } = require('../log')
const COLLECTION_NAME = "pacientes";
const COLLECTION_NAME_CONSULTAS = "consultas";

const utils = require('./utils.js');

class PacienteController {

    async salvarPaciente(paciente) {
        Log.logInfo(`Salvando o paciente ${JSON.stringify(paciente)}`);
        if ((!paciente) || (!paciente.nome) || (!paciente.data_nascimento) || (!paciente.sexo)) {
            throw new ServerError("Campos obrigatórios não preenchidos", 400);
        }

        let id = undefined;
        let pacientesCollectionRef = firebase_admin.firestore().collection(COLLECTION_NAME);
        let doc = null;

        paciente.data_nascimento = utils.iso8601ToDate(paciente.data_nascimento);

        if (paciente.id) {
            doc = await pacientesCollectionRef.doc(paciente.id).get();
        }

        if ((!doc) || (!doc.exists)) {
            let snapshot = await pacientesCollectionRef.where("nome", "==", paciente.nome)
                .where("data_nascimento", "==", paciente.data_nascimento).get();
            if ((snapshot) && (snapshot.docs.length > 0)) {
                doc = await pacientesCollectionRef.doc(paciente.id).get();
            }
        }

        if ((doc) && (doc.exists)) {
            let pac = this.castDocumentData(doc);
            if (pac && !pac.data_cadastro) {
                paciente.data_cadastro = doc.createTime;
            }

            await pacientesCollectionRef.doc(paciente.id).set(paciente);
            id = paciente.id;

        } else {                    
            paciente.data_cadastro = firestore.FieldValue.serverTimestamp();
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

    async excluirPaciente(id) {
        try {
            let pacientesRef = firebase_admin.firestore().collection(COLLECTION_NAME);
            return !!await pacientesRef.doc(id).delete();
        } catch (error) {
            Log.logError(`Erro ao excluir o paciente. Detalhes: ${error}`);
            throw new ServerError("Não foi possível excluir o paciente.", 500);
        }
    }

    async buscarPaciente(id) {
        try {
            let doc = await firebase_admin.firestore().collection(COLLECTION_NAME).doc(id).get();
            return this.castDocumentData(doc);
        } catch (error) {
            Log.logError(`Erro ao buscar o paciente. Detalhes: ${error}`);
            throw new ServerError("Não foi possível buscar o paciente.", 500);
        }
    }

    async buscarPacientes(req) {
        let pacientes = [];
        try {
            let pacientesCollectionRef = firebase_admin.firestore().collection(COLLECTION_NAME);
            let query = null;

            if (req.query.nome) {
                query = query ? query : pacientesCollectionRef.orderBy("nome")
                    .startAt(req.query.nome)
                    .endAt(req.query.nome + '\uf8ff');
            }
            if (req.query.data_nascimento) {
                let dataNascimento = utils.iso8601ToDate(req.query.data_nascimento);
                query = query ? query : pacientesCollectionRef.where("data_nascimento", "==", dataNascimento);
            }

            //na pratica nao precisa desse if, mas iria ficar confuso pq são objetos diferentes
            let snapshot = undefined;
            if (query) {
                snapshot = await query.get();
            } else {
                //vamos limitar a 25 para nao trazer o banco inteiro caso nao tenha filtro algum
                snapshot = await pacientesCollectionRef.limit(25).get();
            }

            //nao usei o forEach pq não achei jeito de fazer o await dentro do callback funcionar
            for (let i=0;i<snapshot.size;i++){
                let doc = snapshot.docs[i];
                let paciente = this.castDocumentData(doc);
                if (paciente) {
                    if (req.query.tcm) {
                        if (await this.filterTcm(paciente)) {                            
                            pacientes.push(paciente);
                        }
                    } else {
                        pacientes.push(paciente);
                    }
                };
            }
            
            return pacientes;
        } catch (error) {
            Log.logError(`Erro ao buscar os pacientes. Detalhes: ${error}`);
            throw new ServerError("Não foi possível buscar os pacientes.", 500);
        }
    }

    async filterTcm(paciente) {
        Log.logInfo(`Pesquisando por TCM do paciente ${paciente.id}`)
        let ref = firebase_admin.firestore().collection(COLLECTION_NAME).doc(paciente.id).collection(COLLECTION_NAME_CONSULTAS)
        let snapshot = await ref.where("id_paciente", "==", paciente.id)
            .select('id_paciente', 'data', 'teste_srq_resultado', 'anti_depressivo')
            .orderBy("data", 'desc')
            .limit(1)
            .get();
        
        if (snapshot && !snapshot.empty) {
            let doc = snapshot.docs[0];
            if (doc && doc.exists) {
                let consulta = doc.data();                
                if ((consulta.teste_srq_resultado > 6) || (consulta.anti_depressivo)) {
                    return true;
                }
            }
        }
        return false;
    }

    castDocumentData(doc) {
        if (doc && doc.exists) {
            let paciente = doc.data();
            paciente.id = doc.id;
            paciente.data_nascimento = utils.timeStampToIso8601(paciente.data_nascimento);

            return paciente;
        }
    }

}

module.exports = PacienteController;