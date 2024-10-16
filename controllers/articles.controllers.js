const { selectArticlesById, selectAllArticles, selectAllCommentsByArticleId } = require("../models/articles.models")

exports.getAllArticles=(req,res,next)=>{
    selectAllArticles()
    .then((articles)=>{
        res.status(200).send({articles})
    })
}

exports.getArticlesById=(req,res,next)=>{
    const {article_id} = req.params
    selectArticlesById(article_id)
    .then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=>{
        return next(err)
    })
}

exports.getAllCommentsByArticleId=(req,res,next)=>{
    const {article_id}=req.params
    selectAllCommentsByArticleId(article_id)
    .then((comments)=>{
        res.status(200).send({comments})
    })
    .catch((err)=>{
        return next(err)
    })
}