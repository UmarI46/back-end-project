
const apiObj=require("../endpoints.json")

exports.getApis=(req,res,next)=>{
    res.status(200).send({apis: apiObj})
}