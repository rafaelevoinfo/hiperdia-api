const authorize = require("../controllers/auth.controller");
const RelatorioController = require("../controllers/relatorio.controller");

function addRotas(app) {
    app.get('/relatorios/quantitativo/:data_inicial/:data_final',
        async (req, res) => {
            if (await authorize(req, res)) {
                let result = await new RelatorioController().gerarRelatorioQuantitativoPaciente(req.params.data_inicial, req.params.data_final);                
                res.status(200).send({ total_pacientes: result });
            }
        });

    app.get('/relatorios/sociodemografico/:data_inicial/:data_final',
        async (req, res) => {
            if (await authorize(req, res)) {
                let result = await new RelatorioController().gerarRelatorioSociodemografico(req.params.data_inicial, req.params.data_final);                
                res.status(200).send(result);
            }
        });
    app.get('/relatorios/hipertenso-diabetico/:data_inicial/:data_final',
        async (req, res) => {
            if (await authorize(req, res)) {
                let result = await new RelatorioController().gerarRelatorioQuantitativoHipertensoDiabetico(req.params.data_inicial, req.params.data_final);                
                res.status(200).send(result);
            }
        });
}

exports.addRotas = addRotas;

