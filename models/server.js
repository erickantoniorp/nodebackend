const express = require('express')
var cors = require('cors');
const fileUpload  = require('express-fileupload');
const { dbConnection } = require('../db/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //Rutas
        this.userPath = '/api/user';
        this.authPath = '/api/auth';
        this.uploadPath = '/api/uploads';


        //Conectar a BD
        this.databaseConnection();

        //Middlewares
        this.middlewares();
        //Rutas de la App
        this.routes();
    }

    async databaseConnection()
    {
        await dbConnection()
    }

    middlewares()
    {
        //CORS
        this.app.use( cors() );

        //Lectura y Parseo a del body
        this.app.use( express.json() );

        //Directorio Publico
        this.app.use( express.static('public'));

        this.app.use( fileUpload({
            //limits: { fileSize: 50 * 1024 * 1024 },
            createParentPath: true,
            useTempFiles : true,
            tempFileDir : '/tmp/'
          }));
    }

    routes()
    {
        /*
        this.app.get('/', (req, res) => { 
            res.send('Servidor Activo'); 
        } );
        */
        
        this.app.use( this.userPath, require('../routes/user'));
        this.app.use( this.authPath, require('../routes/auth'));
        this.app.use( this.uploadPath, require('../routes/uploads'));

    }

    listen()
    {
        this.app.listen( this.port, () =>{
            console.log('Servidor corriendo en puerto:', process.env.PORT);
        } );
    }
}

module.exports = Server;