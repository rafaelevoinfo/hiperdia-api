const ConsultaController = require("../controllers/consulta.controller");
const authorize = require("../controllers/auth.controller");
const { Log } = require("../log");

function addRotas(app) {
    app.route('/consultas')
        .get(async (req, res) => {
            if (await authorize(req, res)) {
                let vaController = new ConsultaController();
                let vaResult = await vaController.buscarConsultas(req);
                res.status(200).send(vaResult);
            }
        })
        .post(async (req, res) => {
            if (await authorize(req, res)) {
                let vaController = new ConsultaController();
                let vaResult = await vaController.salvar(req.body);
                res.status(200).send(vaResult);
            }
        });
    app.route('/consultas/ultima/:id_paciente')
        .get(async (req, res) => {
            if (await authorize(req, res)) {
                let controller = new ConsultaController();                
                let result = await controller.buscarUltimaConsulta(req.params.id_paciente);
                if (result){
                    res.status(200).send(result);
                }else{
                    res.status(404).send({
                        message:"Nenhuma consulta encontrada"
                    });
                }
                
            }
        });

    app.route('/consultas/:id')
        .get(async (req, res) => {
            if (await authorize(req, res)) {
                let vaController = new ConsultaController();
                let vaResult = await vaController.buscarConsulta(req.params.id);
                res.status(200).send(vaResult);
            }
        })
        .delete(async (req, res) => {
            if (await authorize(req, res)) {
                let vaController = new ConsultaController();
                let vaResult = await vaController.excluir(req.params.id);
                if (vaResult) {
                    res.status(204).send();
                } else {
                    res.status(404).send();
                }
            }
        });
}

exports.addRotas = addRotas;