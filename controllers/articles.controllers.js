const { selectArticlesById, selectAllArticles, selectAllCommentsByArticleId, postACommentOnArticle, updateVoteCountOnArticle } = require("../models/articles.models")

exports.getAllArticles=(req,res,next)=>{
    //const articleQuery= req.query.sort_by
    //if(articleQuery===undefined)articleQuery= 'created_at' 
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

exports.writeACommentOnArticle=(req,res,next)=>{
    const {article_id}=req.params
    const {body, username}=req.body
    postACommentOnArticle(article_id, username, body)
    .then((newComment)=>{
        res.status(201).send({newComment})
    })
    .catch((err)=>{
        return next(err)
    })
}

exports.patchVoteCountOnArticle=(req,res,next)=>{
    const {incVotes}= req.body
    const {article_id}= req.params
    updateVoteCountOnArticle(incVotes, article_id)
    .then((article)=>{
        res.status(201).send({article})
    })
    .catch((err)=>{
        return next(err)
    })
}