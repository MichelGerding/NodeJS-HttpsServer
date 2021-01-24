# Node-HttpsServer

A no dependencies, minimalistic web framework for [nodejs](https://nodejs.org)

```js
const HttpServer = require('HttpServer')
const server = new HttpsServer({port: 8080})

server.get('/', (req, res) => {
    res.send('Hello World')
})

server.listen()
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module avialable throug github

installation is done using the `npm install` command

```bash
$ npm install github:MichelGerding/NodeJS-HttpsServer --save
```

## Features

- Robust routing
- Easy to use middleware
- A template engine using string literals syntax
- Easy to use views
- Easy to create https server

<!-- ## Create your first server

To create a server you feerst need to install the module using npm. But before we can install the module we need to make sure we have node and npm installed. we can do that by running the following commands

```bash
$ node -v
v14.14.3

$ npm -v
6.14.8
```

when you run those commands you should get output simaler outut to what is shown above.  

Once we know that nodejs and npm are installed we can install the module. That can be done by running the following command

```bash
npm install github:MichelGerding/NodeJS-HttpsServer#master --save
```

This will install the latest version of the module and save it as a dependency.

Now that we have installed the module we can create  -->