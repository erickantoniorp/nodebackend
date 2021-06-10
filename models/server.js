const express = require('express')
var cors = require('cors');
const { dbConnection } = require('../db/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //Rutas
        this.userPath = '/api/user';
        this.authPath = '/api/auth';

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

    }

    listen()
    {
        this.app.listen( this.port, () =>{
            console.log('Servidor corriendo en puerto:', process.env.PORT);
        } );
    }
}

module.exports = Server;