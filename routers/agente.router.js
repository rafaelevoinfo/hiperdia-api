const AgenteController = require("../controllers/agente.controller");
const authorize = require("../controllers/auth.controller");

function addRotas(app) {
    app.route('/agentes')
        .get(async (req, res) => {
            if (await authorize(req, res)) {
                let vaController = new AgenteController();
                let vaResult = await vaController.buscarAgentes(req);
                res.status(200).send(vaResult);
            }
        })
        .post(async (req, res) =>{
            if (await authorize(req, res)) {
                let vaController = new AgenteController();
                let vaResult = await vaController.salvarAgente(req.body);
                res.status(200).send(vaResult);
            }
        })
}

exports.addRotas = addRotas;