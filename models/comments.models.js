const db=require("../db/connection.js")

exports.deleteCommentById=((comment_id)=>{
    return db.query(`DELETE FROM comments WHERE comments.comment_id = $1`,[comment_id])
})