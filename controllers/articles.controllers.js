const { selectArticlesById, selectAllArticles, selectAllCommentsByArticleId, postACommentOnArticle, updateVoteCountOnArticle } = require("../models/articles.models")

exports.getAllArticles=(req,res,next)=>{
    const articleQuery= req.query.sort_by
    const articleSortType=req.query.order
    const articleTopic=req.query.topic
    selectAllArticles(articleQuery, articleSortType,articleTopic)
    .then((articles)=>{
        res.status(200).send({articles})
    })
    .catch((err)=>{
        return next(err)
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
    selectArticlesById(article_id).then(()=>{
        return selectAllCommentsByArticleId(article_id)
    })
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