require ('dotenv').config()
const express = require('express')
const MongoClient = require('mongodb').MongoClient;

const credentials = process.env.MONGO_CREDENTIALS
const port = process.env.PORT || 3000
const uri = `mongodb+srv://${credentials}@twittercluster.au6dy.mongodb.net/test?retryWrites=true&w=majority`;

const app = express()
app.use(express.static('public'))

const client = new MongoClient(uri, {useUnifiedTopology: true, useNewUrlParser: true });

async function query(){
    if(!client.isConnected()){
        await client.connect ()
    }
    const options = { 
        sorted:{date:1}
    }

    const collection1 = client.db("BBBChart").collection("Twitter")
    const dados = await collection1.find({},options).sort({date:1}).toArray()
    return dados

}

app.get('/api',async (req,res)=>{
    res.json(await query())
})

app.listen(port,()=>console.log(`Listening on port ${port}...`))