
const { Client }  = require('pg');
/*const client = new Client(
    process.env.DATABASE_URL
);*/

const client = new Client({
    host: process.env.PGSERVER,
    user: process.env.PGUSER,
    password: process.env.PGPASS,
    database: process.env.PGDATABASE,
});

const dbConnection = async() =>{
    try {
        await client.connect();
        console.log('Base de Datos En Linea');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD');
    }
}

const dbQuery = async(text, params) => {
    const start = Date.now()
    const res = await client.query(text, params)
    const duration = Date.now() - start
    console.log('Consulta Ejecutada: ', { text, duration, rows: res.rowCount })
    return res;
}

const dbGetClient = async () => {
    const client = await pool.connect()
    const query = client.query
    const release = client.release
    // Fija un timeout de 5 segundos y luego muestra el log de la ultima consulta del cliente
    const timeout = setTimeout(() => {
      console.error('Un cliente ha sido verificado durante más de 5 segundos.')
      console.error(`La última consulta ejecutada en este cliente fue: ${client.lastQuery}`)
    }, 5000)

    // parche para el método de consulta para realizar un seguimiento de la última consulta ejecutada
    client.query = (...args) => {
      client.lastQuery = args
      return query.apply(client, args)
    }
    client.release = () => {
      // Limpia nuestro tiemout
      clearTimeout(timeout)
      // regresa los metodos a su antigua version, quitando el parche anterior
      client.query = query
      client.release = release
      return release.apply(client)
    }
    return client;
}
 
module.exports = {
    dbConnection,
    dbQuery,
    dbGetClient
}