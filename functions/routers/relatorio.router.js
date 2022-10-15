const authorize = require("../controllers/auth.controller");
const RelatorioController = require("../controllers/relatorio.controller");

function addRotas(app) {
    app.get('/relatorios/quantitativo/:data_inicial/:data_final',
        async (req, res) => {
            if (await authorize(req, res)) {
                let result = await new RelatorioController().gerarRelatorioQuantitativoPaciente(req.params.data_inicial, req.params.data_final);
                console.log(result);
                res.status(200).send({total_pacientes:result});
            }
        });
}

exports.addRotas = addRotas;

