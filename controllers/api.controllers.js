const { selectAllApis } = require("../models/api.models")

exports.getApis=(req,res,next)=>{
    selectAllApis()
    .then((apis)=>{
        res.status(200).send({apis})
    })
}