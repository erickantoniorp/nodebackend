const express = require('express')
var cors = require('cors')

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //Rutas
        this.userPath = '/api/user';

        //Middlewares
        this.middlewares();
        //Rutas de la App
        this.routes();
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

    }

    listen()
    {
        this.app.listen( this.port, () =>{
            console.log('Servidor corriendo en pruero:', process.env.PORT);
        } );
    }
}

module.exports = Server;