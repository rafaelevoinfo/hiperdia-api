const authorize = require('../controllers/auth.controller');
const LoginController = require('../controllers/login.controller')

function addRotas(app) {
    app.route('/check-token')
        .get(async (req, res) => {
            if (await authorize(req, res)) {
                res.status(200).send("token válido");
            }
        });

    app.route('*/login')
        .post(async (req, res) => {
            let vaController = new LoginController();
            let vaResult = await vaController.login(req.body);
            if (vaResult.auth) {
                res.status(200).send(vaResult)
            } else {
                res.status(401).send(vaResult)
            }
        });
}

exports.addRotas = addRotas;