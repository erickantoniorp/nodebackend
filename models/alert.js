const { dbConnection, dbQuery, dbGetClient }  = require('../db/config');
const bcryptjs = require('bcryptjs');

class Alert{

    overwriteAll(json)
    {
        if(json){
            this.id = json.id;
            this.tipo = json.tipo;
            //this.fecha = json.fecha;
            //this.hora = json.hora;
            this.idusuario = json.idusuario;
            this.gps = json.gps;
            this.foto = json.foto;
            this.nivelbateria = json.nivelbateria;
            this.estado = json.estado;
            this.fotourl = json.fotourl;
            this.fechamovil = json.fechamovil;
            this.horamovil = json.horamovil;
        }

    }
    
    constructor(json)
    {
        if(json){
            this.overwriteAll(json);
        }
        else{
            this.id = -1;
            this.tipo = -1;
            this.fecha = null;
            this.hora = null;
            this.idusuario = -1;
            this.gps = null;
            this.foto = null;
            this.nivelbateria = -1;
            this.estado = -1;
            this.fotourl = null;
            this.fechamovil = null;
            this.horamovil = null;
        }
    }

    static instanceOf()
    {
        return new Alert(null);
    }

    static fromDB(row, rewrite=false)
    {
        //console.log('fromDB: ' + row);
        try{
            //para sobreescribir la data en la misma instancia
            if(!rewrite)
            {
                if(row){
                    return new Alert(row);
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
        try{
            this.showMe();
            //if( this.fecha.trim().length>0 ) val = 1;
            //if( this.hora.trim().length>0 ) val = 1;
            if( this.gps.trim().length>0 ) val = 1;
            if( this.nivelbateria.trim().length>0 ) val = 1;
            if( this.fechamovil.trim().length>0 ) val = 1;
            if( this.horamovil.trim().length>0 ) val = 1;
            //if( this.clave.trim().length>0 ) val = 1;
        }catch(err)
        {
            console.log("Error en isValid: " + err);
            return false;
        }
        return val>0 ;
    }

    showMe(){
        console.log( "Gps: " + this.gps );
        console.log( "Nivelbateria: " + this.nivelbateria );        
        console.log( "Fechamovil: " + this.fechamovil );
        console.log( "Horamovil: " + this.horamovil );
    }

    save( idusuario, id=-1 )
    {
        //Para la consulta
        let sql = "";

        const tmpFotoUrl    = ( this.fotourl )?(this.fotourl):"";
        const tmpOtherInfo  = ( this.otrainfo )?(this.otrainfo):"";

        const mAlert = [this.tipo, this.idusuario, this.gps, this.nivelbateria, this.dateToString(this.fechamovil), this.horamovil, tmpFotoUrl, tmpOtherInfo, this.estado ];        
        console.log('mAlert: ' + mAlert);
        //Si es nuevo, id<0
        if( id<0 ) 
        {
            sql = 'INSERT INTO "public"."tbAlerta" (tipo, idusuario, gps, nivelbateria, fechamovil, horamovil, fotourl, otrainfo, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        }
        else{
            sql = 'UPDATE "public"."tbAlerta" SET tipo = $1, idusuario = $2, gps = $3, nivelbateria = $4, fechamovil = $5, horamovil= $6, fotourl= $7, otrainfo=$8, estado = $9 WHERE id = ' + this.id;
        }
        try{
            const result = dbQuery(sql, mAlert);
            return result;
        }
        catch(err)
        {
            console.log("Error: " + err);
            return null;
        }
    }

    updatePhotoById(id, newUrl)
    {
        //Para la consulta
        let sql = "";

        if( id>0 ) 
        {
            sql = 'UPDATE "public"."tbAlerta" SET fotourl = $1 WHERE id = ' + id;
        
            try{
                const result = dbQuery(sql, [newUrl]);
                return result;
            }
            catch(err)
            {
                console.log("Error: " + err);
                return null;
            }
        }

        return null;

    }

    list(idAlert, limit=-1)
    {
        let sql = 'SELECT * FROM "public"."tbAlerta" WHERE estado > 0';
        if ( idAlert>0 )
        {
            sql += ' AND id=' + idAlert;
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

    remove(idAlert)
    {
        let sql = 'UPDATE "public"."tbAlerta" SET estado = -1' ;
        if ( idAlert>0 )
        {
            sql += ' WHERE id=' + idAlert;
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
        let sql = 'SELECT * FROM "public"."tbAlerta" WHERE estado > 0 AND correo=$1 LIMIT 1';

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
    activedAlert(id)
    {
        let sql = 'SELECT * FROM "public"."tbAlerta" WHERE estado > 0 AND id=' + id;

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

    dateToString(fecha)
    {
        if( fecha.length >0)
        {
            var arrayDeCadenas =fecha.split('/');
            const newDate = arrayDeCadenas[2] + arrayDeCadenas[1] + arrayDeCadenas[0];
            return newDate;
        }
        return fecha;
    }
}

module.exports =  Alert;