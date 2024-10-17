const { deleteCommentById } = require("../models/comments.models")

exports.removeCommentById=(req,res,next)=>{
    const {comment_id}=req.params
    deleteCommentById(comment_id)
    .then(()=>{
        res.status(204).send()
    })
    .catch((err)=>{
        return next(err)
    })
}