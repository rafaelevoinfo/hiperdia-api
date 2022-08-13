const AgenteController = require("../controllers/agente.controller");

function addRotas(app, auth, authServer) {
    app.post('/agente', async (req, res) => {
        let vaController = new AgenteController(auth, authServer);
        let vaResult = await vaController.login(req.body);
        if (vaResult.auth) {
            res.status(200).send(vaResult)
        }else{
            res.status(401).send(vaResult)
        }
    });
}

exports.addRotas = addRotas;