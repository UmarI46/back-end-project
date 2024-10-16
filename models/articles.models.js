const db=require("../db/connection.js")

exports.selectAllArticles=((articleQuery, articleSortType)=>{
    const allowedInputs=["title", "topic", "author", "body", "created_at", "ASC", "DESC", "votes", undefined]

    if(articleQuery===undefined)articleQuery="created_at"
    if(articleSortType===undefined) articleSortType= "DESC"

    if(!allowedInputs.includes(articleQuery)){
        return Promise.reject({ status: 404, msg: "Error 404 - Invalid Input Given" })
    }
    if(!allowedInputs.includes(articleSortType.toUpperCase())){
        return Promise.reject({ status: 404, msg: "Error 404 - Invalid Input Given" })
    }

    if(articleQuery===undefined)articleQuery="created_at"
    if(articleSortType===undefined) articleSortType= "DESC"

    articleQuery= " ORDER BY articles." + articleQuery + " " + articleSortType +";"
    let queryStr=`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        INNER JOIN comments
        ON articles.article_id =comments.article_id
        GROUP BY articles.article_id`
    queryStr= queryStr + articleQuery

    return db.query(queryStr)
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

exports.selectAllCommentsByArticleId=((article_id)=>{
    let validId=false
    //console.log( Number(article_id))
    if(typeof Number(article_id) !==NaN){
        db.query(`SELECT * FROM articles 
            WHERE article_id=$1
        ;`,[article_id])
        .then((result)=>{
            if(result.rows.length>0)validId=true
        })
    }
    return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, articles.article_id 
    FROM articles
    INNER JOIN comments
    ON comments.article_id= articles.article_id 
    WHERE articles.article_id = $1
    ORDER BY comments.created_at DESC
    ;`
    ,[article_id])
    .then((result)=>{
        if(result.rows.length===0 && validId===false){
            return Promise.reject({ status: 404, msg: "Error 404 - Article Not Found" })
        } 
        return result.rows
    })
})

exports.postACommentOnArticle=((article_id, username, body)=>{
    return db.query(`INSERT INTO comments
        (article_id, author, body)
        VALUES ($1, $2, $3) RETURNING *
        ;`,[article_id, username, body])

        .then((result)=>{
            if(result.rows.length===0){
                return Promise.reject()
            }
            return result.rows[0]
        })
})

exports.updateVoteCountOnArticle=((incVotes, article_id)=>{
    return db.query(`UPDATE articles SET votes= votes + $1 
        WHERE article_id= $2
        RETURNING *
        ;`,[incVotes, article_id])
    .then((result)=>{
        if(result.rows.length===0 || typeof incVotes==="string") return Promise.reject({ status: 404, msg: "Error 404 - Article Not Found" })
        return result.rows[0]
    })
})