const express=require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getApis } = require("./controllers/api.controllers")
const app=express()

app.get("/api", getApis)

app.get("/api/topics", getTopics)

app.all("*",(req,res,next)=>{
    res.status(404).send({msg:"Error 404 - Endpoint Not Found"})
})

app.use((err,req,res,next)=>{
    if(err.status){
        res.status(500).send({msg:"Internal Server Error"})
    }
    else{next(err)}
})

module.exports=app