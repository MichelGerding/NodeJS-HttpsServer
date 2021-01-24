# Hello world example

```nodejs
const HttpsServer = require('HttpServer');
const server = new HttpsServer({ port: 3000 });

server.get('/', (req, res) => {
    res.send('Hello, Internet!);
})

server.listen()
```

This app starts a server and listens on port 300 for connections. The app responds with "Hello, Internet" for requests to the root URL(/) or ***route***. For every other path, it will respond with a **404 Not Found**.

## Running localy

First you need to create a directory named `myapp`, change to it and run `npm init`. Then you need to install the module as a dependency, as per the [installation guide](./installation.md)

in the `myapp` directory, create a file named `app.js` and copy the code from the example above.

> The req(request) and res(response) are the exact objects that Node provides. The only difference is that some methods and variables are added onto it like `req.body` which returns the body of the request and `res.send()` which writes data to the response and ends it.

```bash
$ node app.js
Listening on: localhost:3000
```

then, load [http://localhost:3000/](http://localhost:3000/) in a browser to see the output.

[Previous: Installation](./installation.md)&#8195;&#8195;&#8195;&#8195;&#8195;[Next: Basic routing](./basicRouting.md)
