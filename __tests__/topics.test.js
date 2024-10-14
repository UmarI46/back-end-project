const request=require("supertest")
const seed=require("../db/seeds/seed.js")
const db=require("../db/connection.js")
const data=require("../db/data/test-data")
const app=require("../app.js")

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    return db.end()
})

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