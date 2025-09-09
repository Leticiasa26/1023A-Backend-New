import 'dotenv/config'
import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';

const app = express ();
const client = new MongoClient ( process.env.MONGO_URI ! );
const db = client.db ( process.env.MONGO_DB );

await client.connect ();

app.use ( express.json () );
app.get ( '/estudantes', async ( req:Request, res:Response ) => {

    const estudantes = await db.collection ( 'estudantes' ) .find () .toArray ();

    res.status ( 200 ) .json ( estudantes );

    });

app.listen ( 8000, () => {

    console.log ( 'O servidor está rodando na porta 8000' );
    
});