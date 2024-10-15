const fs=require("fs/promises")

//DO NOT NEED MODELS IF NOT USING REQUIRE

exports.selectAllApis=(()=>{
    return fs.readFile(`${__dirname}/../endpoints.json`)
    .then((apiData)=>{
        return JSON.parse(apiData)
    })
})