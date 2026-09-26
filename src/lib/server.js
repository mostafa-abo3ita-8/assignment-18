const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const morgan=require('morgan');
const rateLimit=require('express-rate-limit');
const app=express();
const config=require('../config');

app.use(helmet());
app.use(cors({origin:config.clientUrl==='*'?'*':config.clientUrl,credentials:true}));
app.use(express.json({limit:'2mb'}));
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(rateLimit({windowMs:15*60*1000,max:300}));
app.get('/health',(req,res)=>res.json({status:'ok',service:'social-media-api'}));
app.get('/',(req,res)=>res.json({message:'Social Media API',version:'1.0.0'}));
app.use('/api/v1',require('../routes/v1/v1'));
app.use((err,req,res,next)=>res.status(err.status||500).json({message:err.message||'Internal server error'}));
module.exports=app;
