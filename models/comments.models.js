const db=require("../db/connection.js")

exports.deleteCommentById=((comment_id)=>{
    return db.query(`DELETE FROM comments WHERE comments.comment_id = $1 RETURNING *;`,[comment_id])
    .then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({ status: 404, msg: "Error 404 - Comment Not Found" })
        }
    })
})