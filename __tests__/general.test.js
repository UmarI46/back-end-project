const request=require("supertest")
const seed=require("../db/seeds/seed.js")
const db=require("../db/connection.js")
const data=require("../db/data/test-data")
const app=require("../app.js")

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    db.end()
})

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