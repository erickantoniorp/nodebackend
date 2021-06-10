const { dbConnection, dbQuery, dbGetClient }  = require('../db/config');
const bcryptjs = require('bcryptjs');

class User{

    overwriteAll(json)
    {
        if(json){
            this.id = json.id;
            this.correo = json.correo;
            this.nombres = json.nombres;
            this.apellidop = json.apellidop;
            this.apellidom = json.apellidom;
            this.dni_ce = json.dni_ce;
            this.fechanac = json.fechanac;
            this.clave = json.clave;
            this.foto = json.foto;
            this.celular = json.celular;
            this.idoperador = json.idoperador;
            this.estado = json.estado;
            this.tipodoc = json.tipodoc;
            this.sexo = json.sexo;
            this.idrol = json.idrol;
        }

    }
    constructor(json)
    {
        if(json){
            this.overwriteAll(json);
        }
        else{
            this.id = -1;
            this.correo = null;
            this.nombres = null;
            this.apellidop = null;
            this.apellidom = null;
            this.dni_ce = null;
            this.fechanac = null;
            this.clave = null;
            this.foto = null;
            this.celular = null;
            this.idoperador = -1;
            this.estado = -1;
            this.tipodoc = -1;
            this.sexo = -1;
            this.idrol = 0;
        }
    }

    static instanceOf()
    {
        return new User(null);
    }

    static fromDB(row, rewrite=false)
    {
        //console.log('fromDB: ' + row);
        try{
            //para sobreescribir la data en la misma instancia
            if(!rewrite)
            {
                if(row){
                    return new User(row);
                }
            }
            else{
                this.overwriteAll(row);
            }

        }catch(err)
        {
            console.log('Error al Crear Instancia de Usuario desde la BD(fromBD): ' + err);
            return null;
        }
    }

    //validacion si lo enviado para el usuario es correcto, por modificar y mejorar
    isValid()
    {
        let val = -1;
        if( this.correo.trim().length>0 ) val = 1;
        if( this.nombres.trim().length>0 ) val = 1;
        if( this.apellidop.trim().length>0 ) val = 1;
        if( this.apellidom.trim().length>0 ) val = 1;
        if( this.dni_ce.trim().length>0 ) val = 1;
        if( this.fechanac.trim().length>0 ) val = 1;
        if( this.celular.trim().length>0 ) val = 1;
        //if( this.clave.trim().length>0 ) val = 1;
        return ( val>0 );
    }

    save(id)
    {
        //Para la consulta
        var sql = "";

        //Para Encriptar la clave
        const salt = bcryptjs.genSaltSync();
        const encryptedPassword = bcryptjs.hashSync( this.clave, salt );

        const mUser = [this.correo, this.nombres, this.apellidop, this.apellidom, this.dni_ce, this.dateToString(), encryptedPassword, this.celular, this.idoperador, this.estado, this.tipodoc, this.sexo ];        //Si es nuevo, id<0

        if( id<0 ) 
        {
            sql = 'INSERT INTO "public"."tbUsuario" (correo, nombres, apellidop, apellidom, dni_ce, fechanac, clave, celular, idoperador, estado, tipodoc, sexo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
        }
        else{
            sql = 'UPDATE "public"."tbUsuario" SET correo = $1, nombres = $2, apellidop = $3, apellidom = $4, dni_ce = $5, fechanac= $6, clave = $7, celular = $8, idoperador = $9, estado = $10, tipodoc = $11, sexo = $12 WHERE id = ' + this.id;
        }
        try{
            const result = dbQuery(sql, mUser);
            return result;
        }
        catch(err)
        {
            console.log("Error: " + err);
            return null;
        }
    }

    list(iduser, limit=-1)
    {
        var sql = 'SELECT * FROM "public"."tbUsuario" WHERE estado > 0';
        if ( iduser>0 )
        {
            sql += ' AND id=' + iduser;
        }

        if(limit >0)
        {
            sql += ' LIMIT ' + limit;
        }

        try{
            const result = dbQuery(sql);
            return result;
        }
        catch(err)
        {
            console.log("Error: " + err);
            return null;
        }

    }

    remove(iduser)
    {
        var sql = 'UPDATE "public"."tbUsuario" SET estado = -1' ;
        if ( iduser>0 )
        {
            sql += ' WHERE id=' + iduser;
        }

        try{
            const result = dbQuery(sql);
            return result;
        }
        catch(err)
        {
            console.log("Error: " + err);
            return null;
        }
    }

    //Para validar si el correo existe en la bd
    validEmail(email)
    {
        var sql = 'SELECT * FROM "public"."tbUsuario" WHERE estado > 0 AND correo=$1 LIMIT 1';

        try{
            const result = dbQuery(sql, [email]);
            return result;
        }
        catch(err)
        {
            console.log("Error: " + err);
            return null;
        }
    }

    //Para validar si el usuario está activo por el campo estado
    activedUser(id)
    {
        var sql = 'SELECT * FROM "public"."tbUsuario" WHERE estado > 0 AND id=' + id;

        try{
            const result = dbQuery(sql);
            return result;
        }
        catch(err)
        {
            console.log("Error: " + err);
            return null;
        }
    }

    static findbyId(id)
    {

    }

    dateToString()
    {
        if( this.fechanac.length >0)
        {
            var arrayDeCadenas = this.fechanac.split('/');
            const newDate = arrayDeCadenas[2] + arrayDeCadenas[1] + arrayDeCadenas[0];
            return newDate;
        }
        return this.fechanac;
    }
}

module.exports =  User;