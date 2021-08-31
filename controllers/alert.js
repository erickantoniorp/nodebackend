const { response, request } = require('express');
const Alert = require('../models/alert');


const alertGet = async(req = request, res = response) => { 

    const { id } = req.query; //Cuando se manda en la url /alert/id
    //const { limit } = req.query; //Cuando haga paginacion

    const newAlert = Alert.instanceOf();
    console.log(newAlert);
    var result = null;

    if( id )
    {
        console.log('Lista alert Con ID: ' + id);
        result = await newAlert.list(id);
    }
    else
    {
        console.log('Lista Todos');
        result = await newAlert.list(-1);
    }

    res.json({
        msg: 'GET API',
        alerts : result.rows
    });

};

const alertPut = async (req, res) => { 
    const body = req.body;
    const { id } = req.params; //Cuando hay un parametro enviado, por ejemplo en un json

    //Desestrcturo todo lo que no necesito grabar
    const { idusuario, fecha, hora, ...resto} = req.body;

    const newAlert = new Alert(body);
    var result = null;

    if( newAlert.isValid() )
    {
        result = await newAlert.save(id);
    }

    res.json({
        msg: 'PUT API',
        id : id
    });
};

const alertPost = async (req, res) => { 


    const body = req.body;
    const newAlert = new Alert(body);
    var result = null;

    if( newAlert.isValid() )
    {
        result = await newAlert.save(-1);
        //console.log( result );
    }


    res.json({
        msg: 'POST API', 
        //res : result
        body
    });
};

const alertDelete = async(req, res) => {
    const { id } = req.params;
    const  uid  = req.uid;

    const newAlert = Alert.instanceOf();
    //console.log(newalert);
    var result = null;

    if( id )
    {
        //console.log('Borra alert Con ID: ' + id);
        result = await newAlert.remove(id);
    }

    res.json({
        msg: 'DELETE API',
        id, 
        result
        /*,
        uid, 
        authalert : req.authalert*/
    });
};

const alertPatch = (req, res) => { 
    res.json({
        msg: 'PATCH API'
    });
};

module.exports = { alertGet, alertPost, alertDelete, alertPatch, alertPut }