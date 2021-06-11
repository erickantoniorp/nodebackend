const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fileUploadHelper = ( files, extensions = ['jpg', 'jpeg', 'png', 'gif'], folderName='' )=>{

    //console.log('req.files >>>', req.files); // eslint-disable-line
    return new Promise( (resolve, reject) => {

        const { archivo } = files;

        const splitFileName = archivo.name.split('.');
        const extension = splitFileName[ splitFileName.length - 1];
    
        //Validar Extensiones válidas
        const validExtensions = extensions;
    
        if( !validExtensions.includes(extension) ){
            reject(`La exntensión ${extension} no está permitida. Las válidas son: ${ validExtensions }`);
        }
    
        const newName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname , '../uploads/' , folderName, newName);
    
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
    
            resolve(newName);
        });

    });



}

module.exports = {
    fileUploadHelper
}