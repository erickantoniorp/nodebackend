const { response } = require("express")

//Para validar que haya un archivo al subir
const validateFileToUpload = (req, res = response, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });
    }

    next();

}


module.exports = {
    validateFileToUpload
}
