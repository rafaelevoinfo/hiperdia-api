const firebase_admin = require('firebase-admin');
const { ServerError } = require('../middlewares/handle_error.middleware.js');
const { Log } = require('../log')
const utils = require('./utils.js');
const { differenceInCalendarYears } = require('date-fns');
const COLLECTION_PACIENTE = 'pacientes';
const COLLECTION_CONSULTAS = 'consultas';




class RelatorioController {


    _contarIdade(totalizador, pac) {
        if (pac.data_nascimento) {
            let idade = differenceInCalendarYears(
                new Date(),
                pac.data_nascimento.toDate()
            );

            let faixa = '';
            let ordem = 0;
            switch (true) {
                case (idade < 18):
                    faixa = 'Menor de 18'
                    ordem = 1;
                    break;
                case ((idade >= 18) && (idade <= 25)):
                    faixa = 'Entre 18 e 25'
                    ordem = 2;
                    break;
                case ((idade >= 26) && (idade <= 35)):
                    faixa = 'Entre 26 e 35'
                    ordem = 3;
                    break;
                case ((idade >= 36) && (idade <= 45)):
                    faixa = 'Entre 36 e 45'
                    ordem = 4;
                    break;
                case ((idade >= 46) && (idade <= 55)):
                    faixa = 'Entre 46 e 55'
                    ordem = 5;
                    break;
                case ((idade >= 56) && (idade <= 65)):
                    faixa = 'Entre 56 e 65'
                    ordem = 6;
                    break;
                default:
                    faixa = 'Acima de 65';
                    ordem = 99;
            }
            let reg = totalizador.idade.find(f => f.faixa == faixa);
            if (reg) {
                reg.qtde++;
            } else {
                reg = {
                    faixa,
                    ordem,
                    qtde: 1
                }
                totalizador.idade.push(reg);
            }
        }
    }

    _contarFilhos(totalizador, pac) {
        if (pac.qtde_filhos) {
            let faixa = '';
            let ordem = 0;
            switch (true) {
                case (parseInt(pac.qtde_filhos) < 1):
                    faixa = 'Nenhum'
                    ordem = 1;
                    break;
                case (parseInt(pac.qtde_filhos) < 2):
                    faixa = 'Apenas um'
                    ordem = 2;
                    break;
                case (parseInt(pac.qtde_filhos) < 3):
                    faixa = 'Entre 1 e 2'
                    ordem = 3;
                    break;
                case (parseInt(pac.qtde_filhos) < 5):
                    faixa = 'Entre 3 e 5'
                    ordem = 4;
                    break;
                default:
                    faixa = 'Acima de 5'
                    ordem = 99;
            }
            let reg = totalizador.filhos.find(f => f.faixa == faixa);
            if (reg) {
                reg.qtde++;
            } else {
                reg = {
                    faixa,
                    ordem,
                    qtde: 1
                }
                totalizador.filhos.push(reg);
            }
        }
    }

    _contarDemais(array, campo) {
        let valor = campo ?? 'Não informado';
        let reg = array.find(f => f.faixa == valor);
        if (reg) {
            reg.qtde++;
        } else {
            reg = {
                faixa: valor,
                qtde: 1
            }
            array.push(reg);
        }
    }

    _contarRegistros(pacientes) {
        let totalizador = {
            idade: [],
            sexo: [],
            escolaridade: [],
            filhos: []
        };
        for (let pac of pacientes) {
            this._contarIdade(totalizador, pac);
            this._contarFilhos(totalizador, pac);
            this._contarDemais(totalizador.sexo, pac.sexo);
            this._contarDemais(totalizador.escolaridade, pac.escolaridade);
        }
        let sortByOrdem = (a, b) => a.ordem - b.ordem;
        totalizador.idade.sort(sortByOrdem);
        totalizador.filhos.sort(sortByOrdem);

        return totalizador;
    }

    async gerarRelatorioSociodemografico(dataInicialIso, dataFinalIso) {
        Log.logInfo(`Gerando relatório socio demográfico entre as datas ${dataInicialIso} e ${dataFinalIso}`);
        let pacientes = [];
        let data_inicial = utils.iso8601ToDate(dataInicialIso);
        let data_final = utils.iso8601ToDate(dataFinalIso);

        if ((data_inicial) && (data_final)) {
            //pegar o paciente e todas as consultas que tiverem dentro dessa periodo
            let snap = await firebase_admin.firestore().collectionGroup(COLLECTION_CONSULTAS)
                .where('data', '>=', data_inicial)
                .where('data', '<=', data_final)
                .select()
                .get();

            let ids = [];
            for (let consulta of snap.docs) {
                let idPac = consulta.ref.parent.parent.id;
                if (!ids.find(id => id == idPac)) {
                    ids.push(idPac);
                    let pacDoc = await firebase_admin.firestore().collection(COLLECTION_PACIENTE).doc(idPac)
                        .get();
                    if ((pacDoc) && (pacDoc.exists)) {
                        let pac = pacDoc.data();
                        pacientes.push(pac);
                    }
                }
            }

            return this._contarRegistros(pacientes);
        }
    }

    async gerarRelatorioQuantitativoPaciente(dataInicialIso, dataFinalIso) {
        Log.logInfo(`Gerando relatório quantitativo entre as datas ${dataInicialIso} e ${dataFinalIso}`);
        let data_inicial = utils.iso8601ToDate(dataInicialIso);
        let data_final = utils.iso8601ToDate(dataFinalIso);

        if ((data_inicial) && (data_final)) {
            //vamos colocar a hora maxima na data_final para sempre trazer os registros do dia
            data_final.setHours(23, 59, 59, 0);
            let pacientes = await firebase_admin.firestore().collection(COLLECTION_PACIENTE)
                .where('data_cadastro', '>=', data_inicial)
                .where('data_cadastro', '<=', data_final)
                .select("data_cadastro")
                .get();
            return pacientes?.size ?? 0;
        } else {
            throw new ServerError('Datas inválidas', 400);
        }

    }

    async gerarRelatorioQuantitativoHipertensoDiabetico(dataInicialIso, dataFinalIso) {
        Log.logInfo(`Gerando relatório hipertenso/diabetico entre as datas ${dataInicialIso} e ${dataFinalIso}`);
        let data_inicial = utils.iso8601ToDate(dataInicialIso);
        let data_final = utils.iso8601ToDate(dataFinalIso);

        if ((data_inicial) && (data_final)) {
            //pegar o paciente e todas as consultas que tiverem dentro dessa periodo
            let snap = await firebase_admin.firestore().collectionGroup(COLLECTION_CONSULTAS)
                .where('data', '>=', data_inicial)
                .where('data', '<=', data_final)
                .select("diabetes", "hipertensao_arterial")
                .get();

            let diabetico = 0;
            let hipertenso = 0;
            let ids = [];
            snap.forEach(conRef => {
                if ((conRef) && (conRef.exists)) {
                    let idPac = conRef.ref.parent.parent.id;
                    if (!ids.find(id => id == idPac)) {
                        ids.push(idPac);
                        let consulta = conRef.data();
                        if (consulta.diabetes) {
                            diabetico++;
                        }
                        if (consulta.hipertensao_arterial) {
                            hipertenso++;
                        }
                    }
                }
            });

            return {
                diabetico,
                hipertenso
            }
        } else {
            throw new ServerError('Datas inválidas', 400);
        }

    }
}

module.exports = RelatorioController;