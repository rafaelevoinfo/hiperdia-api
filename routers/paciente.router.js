const PacienteController = require("../controllers/paciente.controller");
const authorize = require("../controllers/auth.controller");

function addRotas(app) {
    app.route('/pacientes')
        .get(async (req, res) => {
            if (await authorize(req, res)) {
                let vaController = new PacienteController();
                let vaResult = await vaController.buscarPacientes(req);
                res.status(200).send(vaResult);
            }
        })
        .post(async (req, res) => {
            if (await authorize(req, res)) {
                let vaController = new PacienteController();
                let vaResult = await vaController.salvarPaciente(req.body);
                res.status(200).send(vaResult);
            }
        });

    app.route('/pacientes/:id')
        .delete(async (req, res) => {
            if (await authorize(req, res)) {
                let vaController = new PacienteController();
                let vaResult = await vaController.excluirPaciente(req.params.id);
                if (vaResult) {
                    res.status(204).send();
                } else {
                    res.status(404).send();
                }
            }
        });
}

exports.addRotas = addRotas;