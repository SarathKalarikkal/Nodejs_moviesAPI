const writeToFile = require("../util/write-to-file");

module.exports = (req, res) =>{

    const baseUrl = req.url.substring(0, req.url.lastIndexOf('/') + 1)
    const id = req.url.split('/')[3] 
    
    console.log('Base URL:', baseUrl);
    console.log('ID:', id);

    const regexV4 = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');

    if (!regexV4.test(id)) {
        res.writeHead(400, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ title: "Validation failed", message: "UUID not found" }))

    }else if(baseUrl === '/api/movies/' && regexV4.test(id)){
       
        const index = req.movies.findIndex((movie)=>{
            return movie.id === id
        })

        if(index === -1){
            res.statusCode = 404;
            res.write(JSON.stringify({ title: "Not found", message: "Movie not found" }))
            res.end()
        }else{
            req.movies.splice(index, 1)
            writeToFile(req.movies)
            res.writeHead(204, { "Content-Type": "application/json" })
            res.end(JSON.stringify(req.movies))
        }

    }else {
        res.writeHead(404, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ title: "Not found", message: "Route not found" }))
    }
}