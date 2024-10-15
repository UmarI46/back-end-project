const request=require("supertest")
const seed=require("../db/seeds/seed.js")
const db=require("../db/connection.js")
const data=require("../db/data/test-data")
const app=require("../app.js")

//Refactor to not use FS after core
const fs=require("fs/promises")

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    return db.end()
})

//API TESTS===========================================
//===================================================
//===================================================

describe("/api",()=>{
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

describe("/api/<endpoint_that_doesn't_exist>",()=>{
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

describe("/api/topics",()=>{
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

//GET ARTICLE BY ID==================================
describe("/api/articles/:article_id",()=>{
    test("GET: 200 - Retrieved data from article based on id.",()=>{
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body:{article}})=>{
           expect(article.title).toBe("Living in the shadow of a great man") 
           expect(article.topic).toBe("mitch")
           expect(article.author).toBe("butter_bridge")
           expect(article.body).toBe("I find this existence challenging")
           //MENTOR is this the correct way to check for "created_at" as when I ran it in the format of the others it would create a new time, I think.
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