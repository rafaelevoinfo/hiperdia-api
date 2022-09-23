const { ServerError } = require('../middlewares/handle_error.middleware');
const firebase_admin = require('firebase-admin');
const { Log } = require('../log')
const utils = require('./utils.js');
const COLLECTION_NAME = "consultas";

class ConsultaController {

    async salvar(consulta) {
        Log.logInfo(`Salvando a consulta ${JSON.stringify(consulta)}`);
        if ((!consulta) || (!consulta.id_paciente) || (!consulta.data)) {
            throw new ServerError("Campos obrigatórios não preenchidos", 400);
        }

        let id = undefined;
        let consultasCollectionRef = firebase_admin.firestore().collection(COLLECTION_NAME);
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
            await consultasCollectionRef.doc(consulta.id).set(consulta);
            id = consulta.id;
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

    async buscarConsulta(id) {
        try {
            let doc = await firebase_admin.firestore().collection(COLLECTION_NAME).doc(id).get();
            return this.castDocumentData(doc)
        } catch (error) {
            Log.logError(`Erro ao buscar uma consulta. Detalhes: ${error}`);
            throw new ServerError("Não foi possível busca a consulta.", 500);
        }
    }

    async buscarUltimaConsulta(id_paciente) {
        try {
            let snapshot = await firebase_admin.firestore().collection(COLLECTION_NAME)
                .where("id_paciente", "==", id_paciente)
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
            let consultasRef = firebase_admin.firestore().collection(COLLECTION_NAME).select(
                'id_paciente', 'data', 'hipertensao_arterial', 'diabetes'
            );
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

    async buscarGerarPlanoAcaoConsulta(id) {
        Log.logInfo("Buscando plano de ação")
        let consulta = await this.buscarConsulta(id);
        if (consulta) {
            if (!consulta.plano) {
                consulta.plano = this._gerarPlano(consulta)
                await this.salvar(consulta);
            }
            return consulta.plano;
        } else {
            Log.logError(`Consulta de ${id} não existe`);
            throw new ServerError("Consulta inexistente", 500);
        }
    }

    _gerarPlano(consulta) {
        return {
            id: 1,
            data_consulta: new Date(),
            recomendacoes: [
                {
                    problema: "Não realização de exercício físico ou realizar pouco",
                    intervencoes: ['Pratique atividade física regularmente, sob a supervisão de um profissional capacitado, mas realize um lanche 30 minutos antes para ter energia suficiente para realizar o exercício!',
                        'Orientar sobre a importância da atividade física para controle do nível glicêmico, da pressão arterial e para o bem-estar geral.',
                        'Orientar e estimular a participação em grupos de atividade física realizados na unidade de saúde.']
                }
            ]
        }
    }

    castDocumentData(doc) {
        if (doc && doc.exists) {
            let consulta = doc.data();
            consulta.id = doc.id;
            consulta.data = utils.timeStampToIso8601(consulta.data);
            consulta.data_ultima_consulta = utils.timeStampToIso8601(consulta.data_ultima_consulta);
            consulta.data_ultima_consulta_odontologica = utils.timeStampToIso8601(consulta.data_ultima_consulta_odontologica);
            return consulta;
        }
    }

}

module.exports = ConsultaController;