const fs=require("fs/promises")

exports.selectAllApis=(()=>{
    return fs.readFile(`${__dirname}/../endpoints.json`)
    .then((apiData)=>{
        return JSON.parse(apiData)
    })
})