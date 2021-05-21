const { response, request } = require('express');

const userGet = (req = request, res = response) => { 

    const params = req.query;
    const { q, nombre, apikey } = req.query;

    res.json({
        msg: 'GET API',
        params: params, 
        q,
        nombre,
        apikey
    });
};

const userPut = (req, res) => { 

    const { id } = req.params;
    res.json({
        msg: 'PUT API',
        id : id
    });
};

const userPost = (req, res) => { 

    const body = req.body;
    const { nombre, edad } = req.body;

    res.json({
        msg: 'POST API', 
        body,
        nombre, edad
    });
};

const userDelete = (req, res) => { 
    res.json({
        msg: 'DELETE API'
    });
};

const userPatch = (req, res) => { 
    res.json({
        msg: 'PATCH API'
    });
};

module.exports = { userGet, userPost, userDelete, userPatch, userPut }