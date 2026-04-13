import { Pool } from "pg";


async function connect() {
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    })

    const client = await pool.connect();
    console.log("Conectado!")
}