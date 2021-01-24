# Basic routing

***Routing*** revers to determinign how an application repsonds to a client request to a particular endpoint, which is a URI (or a path) and a specific HTTP request method (GET, POST, and so on).

Each route can have a handeler function, which is executed when the route is matched.

Route definiton takes the following structure:

```js
app.METHOD(PATH, HANDELER)
```

Where:

- **app** is an instance of HttpsServer
- **METHOD** is an [HTTP request method](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods), in lowercase/
- **PATH** is a path on the server
- **HANDELER** is the function to be executed when the route is matched

> This tutorial assumes that an instance of HttpsServer named app is created and the server is running. If you are not familiar with creating an app and starting it, see the [Hello Internet example](./helloWorld.md).

The following examples illustarte defining simple routes.

Repond with `Hello World!` on the homepage

```js
app.get('/', function (req, res) {
  res.send('Hello World!')
})
```

Repond to POST request on the root route(/), the application home page:

```js
app.post('/', function (req, res) {
  res.send('Got a POST request')
})

```

Repond to a PUT request on the `/user` route:

```js
app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user')
})
```

Repond to a PUT request on the `/user` route:

```js
app.delete('/user', function (req, res) {
  res.send('Got a DLETE request at /user')
})
```

[Previous: Hello Internet](./helloWorld.md)&#8195;&#8195;&#8195;&#8195;&#8195;
