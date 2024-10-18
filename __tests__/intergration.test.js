const request=require("supertest")
const seed=require("../db/seeds/seed.js")
const db=require("../db/connection.js")
const data=require("../db/data/test-data")
const app=require("../app.js")

//Refactor to not use FS after core
const fs=require("fs/promises")

//PUT ALL THE CHECK LENGTHS BEFORE THE FOR EACHS
//ERROR 404 CATCH IN APP.JS SAYS ARTICLE SPECIFICALLY

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    return db.end()
})

//API TESTS===========================================
//===================================================
//===================================================

describe("GET /api",()=>{
    test("GET 200: Returns all available endpoints",()=>{
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body:{apis}})=>{
            fs.readFile(`${__dirname}/../endpoints.json`)
            .then((apiObj)=>{
                expect(apis).toEqual(JSON.parse(apiObj))
            })
            expect(apis.length).not.toEqual(0)
        })
    })
})

//GENERAL TESTS=======================================
//===================================================
//===================================================

describe("GET /api/<endpoint_that_doesn't_exist>",()=>{
    test("Error 404 - Endpoint Not Found",()=>{
        return request(app)
        .get("/api/anywhere")
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe("Error 404 - Endpoint Not Found")
        })
    })
})

//TOPICS TESTS========================================
//===================================================
//===================================================

describe("GET /api/topics",()=>{
    test('GET: 200 - Responds with all columns of topics (besides unique id)', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body:{topics}})=>{
            topics.forEach((topic)=>{
                expect(topic).toMatchObject({
                    description:expect.any(String),
                    slug:expect.any(String)
                })
            })
            expect(topics.length).not.toEqual(0)
        })
    })
})

//ARTICLES TESTS======================================
//===================================================
//===================================================

//GET ALL ARTICLES===================================
describe("GET /api/articles",()=>{
    test("GET: 200 - Retrieved all data from articles", ()=>{
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body:{articles}})=>{
            articles.forEach((article)=>{
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
            expect(articles.length).not.toBe(0)
        })
    })
    test("GET: 200 - Retrieved all data from articles in descending order of created_at",()=>{
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body:{articles}})=>{
            expect(articles).toBeSortedBy("created_at",{descending:true})
            
        })
    })
    //QUERIES=========================================
    xtest("GET: 200 - Retrieved all data from articles sorted by the column queried",()=>{
        return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({body: {articles}})=>{
            expect(articles).toBeSortedBy("author",{descending: true})
        })
    })
})

//GET ARTICLE BY ID==================================
describe("GET /api/articles/:article_id",()=>{
    test("GET: 200 - Retrieved data from article based on id.",()=>{
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body:{article}})=>{
           expect(article.title).toBe("Living in the shadow of a great man") 
           expect(article.topic).toBe("mitch")
           expect(article.author).toBe("butter_bridge")
           expect(article.body).toBe("I find this existence challenging")
           expect(article).toMatchObject({ created_at: expect.any(String)})
           expect(article.votes).toBe(100)
           expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        })
    })

    test("Error: 404 - Id is valid but cannot be found",()=>{
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Error 404 - Article Not Found")
        })
    })
    test("Error: 400 - Bad request, Id is not correct data type",()=>{
        return request(app)
        .get("/api/articles/string")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Error 400 - Bad Request Given")
        })
    })
})

//GET ALL COMMENTS BY ARTICLE ID======================

describe("GET /api/articles/:article_id/comments",()=>{
    test("GET: 200 - Received all columns from comments depending on article ID",()=>{
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body:{comments}})=>{
            comments.forEach((comment)=>{
                expect(comment).toMatchObject({
                    comment_id : expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number)
                })
            })
            expect(comments.length).not.toBe(0)
        })
    })
    test("GET: 200 - Received data in descending order of created_at",()=>{
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body:{comments}})=>{
            expect(comments).toBeSortedBy("created_at",{descending:true})
        })
    })
    test("GET: 200 - Received an empty array when given article ID that doesn't have any comments",()=>{
        //console.log("get 200 place")
        return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({body:{comments}})=>{
            expect(Array.isArray(comments)).toBe(true)
        })
    })
    test("Error: 404 - ID Not Found, when given an ID that does not exist",()=>{
        //console.log("error 404 place")
        return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Error 404 - Article Not Found")
        })
    })
    xtest("Error: 400 - Bad request, ID is not correct data type",()=>{
        console.log("error 400 place")
        return request(app)
        .get("/api/articles/string/comments")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Error 400 - Bad Request Given")
        })
    })
})

//POST A COMMENT ON AN ARTICLE========================
describe("POST /api/articles/:article_id/comments",()=>{
    test("POST: 201 - Posted a comment on an article",()=>{
        const testComment={username: "butter_bridge",
            body:"Lorum Ipsum..."
        }
        return request(app)
        .post("/api/articles/3/comments")
        .send(testComment)
        .expect(201)
        .then(({body:{newComment}})=>{
            expect(newComment.comment_id).toBe(19)
            expect(newComment.body).toBe("Lorum Ipsum...")
            expect(newComment.article_id).toBe(3)
            expect(newComment.votes).toBe(0)
            expect(newComment.author).toBe("butter_bridge")
            expect(typeof newComment.created_at).toBe("string")
        })
    })
    test("POST: 201 - Still posts when given extra properties in the request object",()=>{
        const testComment={username: "butter_bridge",
            body:"Lorum Ipsum...",
            votes:500
        }
        return request(app)
        .post("/api/articles/3/comments")
        .send(testComment)
        .expect(201)
        .then(({body:{newComment}})=>{
            expect(newComment.comment_id).toBe(19)
            expect(newComment.body).toBe("Lorum Ipsum...")
            expect(newComment.article_id).toBe(3)
            expect(newComment.votes).toBe(0)
            expect(newComment.author).toBe("butter_bridge")
            expect(typeof newComment.created_at).toBe("string")
        })
    })
    test("Error: 404 - Cannot Find That Article ID",()=>{
        const testComment={username: "butter_bridge",
            body:"Lorum Ipsum..."
        }
        return request(app)
        .post("/api/articles/999/comments")
        .send(testComment)
        .expect(404)
        .then(({body:{msg}})=>{
            expect(msg).toBe("Error 404 - Article Not Found")
        })

    })
    test("Error: 400 - Bad request, ID is not correct data type",()=>{
        const testComment={username: "butter_bridge",
            body:"Lorum Ipsum..."
        }
        return request(app)
        .post("/api/articles/string/comments")
        .send(testComment)
        .expect(400)
        .then(({body:{msg}})=>{
            expect(msg).toBe("Error 400 - Bad Request Given")
        })
    })
    test("Error: 400 - Bad request, No body text given.",()=>{
        const testComment={username: "butter_bridge"}
        return request(app)
        .post("/api/articles/3/comments")
        .send(testComment)
        .expect(400)
        .then(({body:{msg}})=>{
            expect(msg).toBe("Error 400 - Bad Request Given")
        })
    })
    test("Error: 400 - Bad request, No username text given.",()=>{
        const testComment={body:"Lorum Ipsum..."}
        return request(app)
        .post("/api/articles/3/comments")
        .send(testComment)
        .expect(400)
        .then(({body:{msg}})=>{
            expect(msg).toBe("Error 400 - Bad Request Given")
        })
    })
    test("Error: 400 - Bad request, Username does not exist.",()=>{
        const testComment={username: "test_user"}
        return request(app)
        .post("/api/articles/3/comments")
        .send(testComment)
        .expect(400)
        .then(({body:{msg}})=>{
            expect(msg).toBe("Error 400 - Bad Request Given")
        })
    })
})

//PATCH VOTES ON ARTICLES=============================
describe("PATCH /api/articles/:article_id",()=>{
    test("PATCH: 201 - Updated votes on an article, returns the article",()=>{
        const testUpdate={incVotes: 127}
        return request(app)
        .patch("/api/articles/3")
        .send(testUpdate)
        .expect(201)
        .then(({body:{article}})=>{
            expect(article.article_id).toBe(3)
            expect(article.title).toBe("Eight pug gifs that remind me of mitch")
            expect(article.topic).toBe("mitch")
            expect(article.author).toBe("icellusedkars")
            expect(typeof article.created_at).toBe("string")
            expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
            expect(article.votes).toBe(127)
        })
    })
    test("PATCH: 201 - Votes should be updated and not just replaced",()=>{
        const testUpdate={incVotes: 50}
        return request(app)
        .patch("/api/articles/1")
        .send(testUpdate)
        .expect(201)
        .then(({body:{article}})=>{
            expect(article.votes).toBe(150)
        })
    })
    test("PATCH: 201 - Votes should also be able to decrease",()=>{
        const testUpdate={incVotes: -50}
        return request(app)
        .patch("/api/articles/1")
        .send(testUpdate)
        .expect(201)
        .then(({body:{article}})=>{
            expect(article.votes).toBe(50)
        })
    })
    test("PATCH: 201 - Should be unaffected if there's other keys in the object",()=>{
        const testUpdate={incVotes: -50, test: "testing"}
        return request(app)
        .patch("/api/articles/1")
        .send(testUpdate)
        .expect(201)
        .then(({body:{article}})=>{
            expect(article.votes).toBe(50)
        })
    })
    test("Error: 404 - Cannot Find That Article ID",()=>{
        const testUpdate={incVotes: -50}
        return request(app)
        .patch("/api/articles/999")
        .send(testUpdate)
        .expect(404)
        .then(({body:{msg}})=>{
            expect(msg).toBe("Error 404 - Article Not Found")
        })

    })
    test("Error: 400 - Bad request, ID is not correct data type",()=>{
        const testUpdate={incVotes: -50}
        return request(app)
        .patch("/api/articles/string")
        .send(testUpdate)
        .expect(400)
        .then(({body:{msg}})=>{
            expect(msg).toBe("Error 400 - Bad Request Given")
        })
    })
    //MENTOR NOTE for some reason this test gives an error 404 even though the other test can produce a 400
    xtest("Error: 400 - Bad request, incVotes is not correct data type",()=>{
        const testUpdate={incVotes: "-50"}
        return request(app)
        .patch("/api/articles/1")
        .send(testUpdate)
        .expect(400)
        .then(({body:{msg}})=>{
            expect(msg).toBe("Error 400 - Bad Request Given")
        })
    })
})

//COMMENTS============================================
//====================================================
//====================================================

//DELETE COMMENTS BY ID===============================
describe("DELETE /api/comments/:comment_id",()=>{
    test("DELETE: 204 - Deleted comment by ID",()=>{
        return request(app)
        .delete("/api/comments/3")
        .expect(204)
    })
    test("Error: 404 - Deleted comment by ID",()=>{
        return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({body:{msg}})=>{
            expect(msg).toBe("Error 404 - Comment Not Found")
        })
    })
    test("Error: 400 - Deleted comment by ID",()=>{
        return request(app)
        .delete("/api/comments/string")
        .expect(400)
        .then(({body:{msg}})=>{
            expect(msg).toBe("Error 400 - Bad Request Given")
        })
    })
})

//USERS===============================================
//====================================================
//====================================================

//GET ALL USERS=======================================
describe("GET /api/users",()=>{
    test("GET: 200 - Get all data from the users table",()=>{
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body:{users}})=>{
            users.forEach((user)=>{
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
            expect(users.length).not.toBe(0)
        })
    })
})
