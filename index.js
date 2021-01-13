const fs = require('fs');

const HttpsServer = require('HttpServer');
const server = new HttpsServer({
    port: 8080, 
    ssl: {

        key : fs.readFileSync('./ssl.key'),
        cert : fs.readFileSync('./ssl.cert'),
    }
})
const path = require('path')

server.public_folder = path.join(__dirname, 'public');

server.get('/', (req,res) => {
    res.setHeader("Content-Type", 'text/html');
    res.end(server.render('./index.html'));
})

server.post('/', (req,res) => {
    console.log('got post request')
    res.end(req.body)
})

server.listen()
