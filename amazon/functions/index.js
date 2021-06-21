const functions = require("firebase-functions"); 
const express = require("express"); 
const dotenv=require("dotenv");
const cors = require("cors"); 
const Stripe = require( "stripe");
const stripe=new Stripe(process.env.STRIPE_API);//stripe secret api key
const bodyParser=require("body-parser")
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
dotenv.config();
app.use(cors());
app.get('/',(req,res)=>{
    res.status(200).send('Hello world');
});
app.post('/payments/create',async (req,res)=>{
    //getting total from front end    
    const total=req.query.total;
    console.log("Totalssssssssssssssssssssssssss",total);

    const paymentIntent=await stripe.paymentIntents.create({
        amount:total,
        currency:"USD",
        payment_method_types: ['card'],
        metadata: {integration_check: 'accept_a_payment'},
    });
res.status(201).send({
    clientSecret:paymentIntent.client_secret,
});
});

//needed to run express on cloud function
exports.api=functions.https.onRequest(app);