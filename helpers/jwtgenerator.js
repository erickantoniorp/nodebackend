const jwt = require('jsonwebtoken');

const generateJWT = ( uid = '') =>{

    return new Promise( (resolve, reject) =>{
        const payload = { uid };
        jwt.sign( payload, process.env.SECRETKEY, {
            expiresIn: '4h'
        }, ( err, token ) =>{
            if( err ){
              console.log('No se pudo generar el token: ' + err);
              reject('No se pudo generar el token: ' + err)  ;
            }
            else{
                resolve(token);
            }
        });
    });
}

module.exports = {
    generateJWT
}