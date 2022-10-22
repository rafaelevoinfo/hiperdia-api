const { ServerError } = require('../middlewares/handle_error.middleware');
const firebase_admin = require('firebase-admin');
const { Log } = require('../log')
const GeradorPlanoAcao = require('../domains/plano-acao');
const utils = require('./utils.js');
const COLLECTION_PACIENTE = "pacientes";
const COLLECTION_NAME = "consultas";

class ConsultaController {

    async salvar(consulta) {
        Log.logInfo(`Salvando a consulta ${JSON.stringify(consulta)}`);
        if ((!consulta) || (!consulta.id_paciente) || (!consulta.data)) {
            throw new ServerError("Campos obrigatórios não preenchidos", 400);
        }
        let pacienteRef = firebase_admin.firestore().collection(COLLECTION_PACIENTE).doc(consulta.id_paciente);
        let snapshot = await firebase_admin.firestore().collection(COLLECTION_PACIENTE).where(firebase_admin.firestore.FieldPath.documentId(), "==", consulta.id_paciente).select().get();

        if (!snapshot.empty) {
            let id = undefined;
            //let consultasCollectionRef = firebase_admin.firestore().collection(COLLECTION_NAME);
            let consultasCollectionRef = pacienteRef.collection('consultas');
            let doc = null;
            consulta.data = utils.iso8601ToDate(consulta.data);
            consulta.data_ultima_consulta = utils.iso8601ToDate(consulta.data_ultima_consulta);
            consulta.data_ultima_consulta_odontologica = utils.iso8601ToDate(consulta.data_ultima_consulta_odontologica);

            if (consulta.id) {
                doc = await consultasCollectionRef.doc(consulta.id).get();
            }
            if ((!doc) || (!doc.exists)) {
                let novaConsulta = await consultasCollectionRef.add(consulta);
                id = novaConsulta.id;
            } else {
                await consultasCollectionRef.doc(consulta.id).set(consulta, {merge:true});
                id = consulta.id;
            }

            if (id) {
                return {
                    id: id
                };
            } else {
                throw new ServerError("Não foi possível salvar a consulta.", 500);
            }
        } else {
            throw new ServerError("Paciente inexistente.", 500);
        }

    }

    async excluir(id_paciente, id_consulta) {
        try {

            return !!await firebase_admin.firestore().collection(COLLECTION_PACIENTE)
                .doc(id_paciente).collection(COLLECTION_NAME)
                .doc(id_consulta).delete();
        } catch (error) {
            Log.logError(`Erro ao excluir a consulta. Detalhes: ${error}`);
            throw new ServerError("Não foi possível excluir a consulta.", 500);
        }

    }

    async buscarConsulta(id_paciente, id_consulta, ignorePlano=true) {
        let consulta = undefined;
        try {
            let doc = await firebase_admin.firestore().collection(COLLECTION_PACIENTE)
                .doc(id_paciente).collection(COLLECTION_NAME)
                .doc(id_consulta).get();

            consulta = this.castDocumentData(doc, ignorePlano);
        } catch (error) {
            Log.logError(`Erro ao buscar uma consulta. Detalhes: ${error}`);
            throw new ServerError("Não foi possível busca a consulta.", 500);
        }
        if (consulta) {
            return consulta
        } else {
            throw new ServerError("Consulta não encontrada.", 404);
        }
    }

    async buscarUltimaConsulta(id_paciente) {
        try {
            let snapshot = await firebase_admin.firestore().collection(COLLECTION_PACIENTE).doc(id_paciente).collection(COLLECTION_NAME)
                .orderBy('data', 'desc')
                .limit(1)
                .get();

            if (snapshot.size > 0) {
                let doc = snapshot.docs[0];
                return this.castDocumentData(doc);
            }
        } catch (error) {
            Log.logError(`Erro ao busca a ultima consulta. Detalhes: ${error}`);
            throw new ServerError("Não foi possível buscar a última consulta.", 500);
        }
    }

    async buscarConsultas(req) {
        let consultas = [];
        try {
            if (!req.query.id_paciente) {
                throw new ServerError("O id do paciente é obrigatório.", 400);
            }
            //vamos pegar apenas os campos necessarios para exibir na tela de listagem
            let query = firebase_admin.firestore().collection(COLLECTION_PACIENTE).doc(req.query.id_paciente).collection(COLLECTION_NAME).select(
                'id_paciente', 'data', 'hipertensao_arterial', 'diabetes'
            );
            //let query = consultasRef.where("id_paciente", "==", req.query.id_paciente);

            if (req.query.data) {                
                let dataConsulta = utils.iso8601ToDate(req.query.data);
                console.log(`Data de pesquisa: ${req.query.data} - ${dataConsulta}`);
                query = query.where("data", "==", dataConsulta);
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

    async buscarGerarPlanoAcaoConsulta(id_paciente, id_consulta, recriar) {
        Log.logInfo("Buscando plano de ação")
        let consulta = await this.buscarConsulta(id_paciente, id_consulta, false);
        if (consulta) {
            if ((!consulta.plano) || (recriar)) {
                let gerador = new GeradorPlanoAcao();
                consulta.plano = gerador.gerarPlano(consulta);
                if (consulta.plano) {
                    await this.salvar(consulta);
                }
                return consulta.plano;
            }
            return this.ajustePlan(consulta.plano);
        } else {
            Log.logError(`Consulta de ${id_consulta} não existe`);
            throw new ServerError("Consulta inexistente", 500);
        }
    }


    ajustePlan(plano) {
        if (plano.data_consulta) { 
            console.log('Plano.data_consulta:', plano.data_consulta);
            plano.data_consulta = utils.timeStampToIso8601(plano.data_consulta);            
        }
        return plano;
    }

    castDocumentData(doc, ignorePlano) {
        if (doc && doc.exists) {
            let consulta = doc.data();
            consulta.id = doc.id;
            consulta.data = utils.timeStampToIso8601(consulta.data);
            consulta.data_ultima_consulta = utils.timeStampToIso8601(consulta.data_ultima_consulta);
            consulta.data_ultima_consulta_odontologica = utils.timeStampToIso8601(consulta.data_ultima_consulta_odontologica);            
            if (ignorePlano){
                delete consulta.plano;
            }
            
            return consulta;
        }
    }

}

module.exports = ConsultaController;