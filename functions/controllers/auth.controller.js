const jwt = require('jsonwebtoken')
const {Log} = require('../log')

async function authorize(req, res) {     
    let token = req.headers['authorization'];     
    if ((!token) || !token.startsWith('Bearer ')) {
        res.status(401).json({
            auth: false,
            message: 'Token não informado ou em formato inválido'
        });
        return false
    }

    token = token.replace('Bearer ', '');
    let vaResult = false;
        
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
            res.status(401).json({
                auth: false,
                message: err.message == "jwt expired" ? "expirado" : "token inválido"
            });
            return;
        }
        
        // se tudo estiver ok, salva no request para uso posterior
        req.email = decoded.email;
        vaResult = true;
    });

    return vaResult;
}

module.exports = authorize