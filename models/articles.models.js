const db=require("../db/connection.js")

exports.selectAllArticles=(()=>{


    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    INNER JOIN comments
    ON articles.article_id =comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    ;`)
    .then((result)=>{
        return result.rows
    })
})

exports.selectArticlesById=((article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({ status: 404, msg: "Error 404 - Article Not Found" })
        }
        return result.rows[0]
    })
})