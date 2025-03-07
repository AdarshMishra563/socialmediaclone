const {MongoClient}=require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const express=require('express');
const app=express();

async function dbConnection(){
    let result = await client.connect();
    let db= result.db('comm');
   return  db.collection('product');
//    let response = await collection.find({}).toArray();

  
}
module.exports=dbConnection;