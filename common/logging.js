module.exports = function (req, res, next){
    console.log(req.method + " " + req.originalUrl)
    if(req.body){
        console.log("body: " + req.body)
    }
    next()
}