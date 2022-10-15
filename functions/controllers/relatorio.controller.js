const firebase_admin = require('firebase-admin');
const { ServerError } = require('../middlewares/handle_error.middleware.js');
const { Log } = require('../log')
const utils = require('./utils.js');
const COLLECTION_NAME = 'pacientes';


class RelatorioController {
    async gerarRelatorioQuantitativoPaciente(dataInicialIso, dataFinalIso) {
        Log.logInfo(`Gerando relatório quantitativo entre as datas ${dataInicialIso} e ${dataFinalIso}`);
        let data_inicial = utils.iso8601ToDate(dataInicialIso);
        let data_final = utils.iso8601ToDate(dataFinalIso);
    
        if ((data_inicial) && (data_final)) {
            //vamos colocar a hora maxima na data_final para sempre trazer os registros do dia
            data_final.setHours(23,59,59,0);
            let pacientes = await firebase_admin.firestore().collection(COLLECTION_NAME)
                .where('data_cadastro', '>=', data_inicial)
                .where('data_cadastro', '<=', data_final)
                .select("data_cadastro")
                .get();
            return pacientes?.size ?? 0;
        } else {
            throw new ServerError('Datas inválidas', 400);
        }

    }
}

module.exports = RelatorioController;