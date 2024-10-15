const request=require("supertest")
const seed=require("../db/seeds/seed.js")
const db=require("../db/connection.js")
const data=require("../db/data/test-data")
const app=require("../app.js")

const fs=require("fs/promises")

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    db.end()
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
            expect(response.status).toBe(404)
            expect(response.body.msg).toBe("Error 404 - Endpoint Not Found")
        })
    })
})

//TOPICS TESTS========================================
//===================================================
//===================================================

describe("/api/topics",()=>{
    test('GET: 200 - Responds with all key\'s data', () => {
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
        })
    })
})