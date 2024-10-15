const db=require("../db/connection.js")

exports.selectArticlesById=((article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({ status: 404, msg: "Error 404 - Article Not Found" })
        }
        return result.rows[0]
    })
})