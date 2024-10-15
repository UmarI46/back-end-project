const { selectAllApis } = require("../models/api.models")

//DO NOT NEED MODELS WHEN REFACTORED TO USE REQUIRE

exports.getApis=(req,res,next)=>{
    selectAllApis()
    .then((apis)=>{
        res.status(200).send({apis})
    })
}