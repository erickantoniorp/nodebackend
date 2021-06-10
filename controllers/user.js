const { response, request } = require('express');
const User = require('../models/user');


const userGet = async(req = request, res = response) => { 

    const { id } = req.query; //Cuando se manda en la url /user/id
    //const { limit } = req.query; //Cuando haga paginacion

    const newUser = User.instanceOf();
    console.log(newUser);
    var result = null;

    if( id )
    {
        console.log('Lista User Con ID: ' + id);
        result = await newUser.list(id);
    }
    else
    {
        console.log('Lista Todos');
        result = await newUser.list(-1);
    }

    res.json({
        msg: 'GET API',
        users : result.rows
    });

};

const userPut = async (req, res) => { 
    const body = req.body;
    const { id } = req.params; //Cuando hay un parametro enviado, por ejemplo en un json

    const newUser = new User(body);
    var result = null;

    if( newUser.isValid() )
    {
        result = await newUser.save(id);
    }

    res.json({
        msg: 'PUT API',
        id : id
    });
};

const userPost = async (req, res) => { 


    const body = req.body;
    const newUser = new User(body);
    var result = null;

    if( newUser.isValid() )
    {
        result = await newUser.save(-1);
        //console.log( result );
    }

    //const { nombre, edad } = req.body;

    res.json({
        msg: 'POST API', 
        res : result
    });
};

const userDelete = async(req, res) => {
    const { id } = req.params;
    const  uid  = req.uid;

    const newUser = User.instanceOf();
    //console.log(newUser);
    var result = null;

    if( id )
    {
        //console.log('Borra User Con ID: ' + id);
        result = await newUser.remove(id);
    }

    res.json({
        msg: 'DELETE API',
        id, 
        result
        /*,
        uid, 
        authUser : req.authUser*/
    });
};

const userPatch = (req, res) => { 
    res.json({
        msg: 'PATCH API'
    });
};

module.exports = { userGet, userPost, userDelete, userPatch, userPut }