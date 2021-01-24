# installing

Assuming you have already installed [Node.js](https://nodejs.org), create a dirrectory to hold your application, and move into that folder.

```bash
$ mkdir myapp
$ cd myapp
```

Use the `npm init` command to create a `package.json` file for your application. For more information about how `package.json    works, see [Specifics of npm's package.json handeling](https://docs.npmjs.com/cli/v6/configuring-npm/package-json).

```bash
$ npm init
```

This command propmts you for a numebr of things susch as the name and version of your application. You can enter what you want for them or you can simply hit RETURN to accept the defaults for most of them, with the execption being

```text
entry point: (index.js)
```

Enter `app.js`, or whatever you want the name of the main file to be. If you want it to be `index.js`, hit RETURN to accept the default file name.

Now we can install the module in the `myapp` dirrectory and save it in the dependecies list. For example:

```bash
$ npm install github:MichelGerding/NodeJS-HttpsServer#master --save
```

to install the module temporarely and not add it to the dependencies list you do:

```bash
$ npm install github:MichelGerding/NodeJS-HttpsServer#master --no-save
```

[NEXT](./helloWorld.md)