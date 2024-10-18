const express=require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getApis } = require("./controllers/api.controllers")
const { getArticlesById, getAllArticles, getAllCommentsByArticleId, writeACommentOnArticle, patchVoteCountOnArticle } = require("./controllers/articles.controllers")
const { removeCommentById } = require("./controllers/comments.controllers")
const { getAllUsers } = require("./controllers/users.controllers")
const app=express()

app.use(express.json())

app.get("/api", getApis)

app.get("/api/topics", getTopics)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id", getArticlesById)

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId)

app.post("/api/articles/:article_id/comments", writeACommentOnArticle)

app.patch("/api/articles/:article_id", patchVoteCountOnArticle)

app.get("/api/users", getAllUsers)

app.delete("/api/comments/:comment_id", removeCommentById)

app.all("*",(req,res,next)=>{
    res.status(404).send({msg:"Error 404 - Endpoint Not Found"})
})

//ERROR HANDLING =====================================
//====================================================
//====================================================

app.use((err,req,res,next)=>{
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
      } 
    else next(err)
})

app.use((err,req,res,next)=>{
    if(err.code==="22P02" || err.code==="23502"){
        res.status(400).send({msg: "Error 400 - Bad Request Given"})
    }
    else next(err)
})

app.use((err,req,res,next)=>{
    if(err.code==="23503"){
        res.status(404).send({msg: "Error 404 - Article Not Found"})
    }
    else next(err)
})

app.use((err,req,res,next)=>{
    if(err.status){
        res.status(500).send({msg:"Internal Server Error"})
    }
    else{next(err)}
})

module.exports=app