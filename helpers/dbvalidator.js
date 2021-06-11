
//Para validar las colecciones(url) permitidas
const acceptedCollections = ( coleccion='', colecciones = []) =>{
    const included = colecciones.includes( coleccion );

    if(!included){
        throw new Error(`La coleccion ${ coleccion } no está permitida en ${ colecciones}`);
    }
    return true;
}

module.exports = {
    acceptedCollections
}