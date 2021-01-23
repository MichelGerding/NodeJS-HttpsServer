class Route {
  #middleware = [];
  // define a empty callback so we dont get any errors
  callback = function (req, res) {};

  #middlewareMap;
  constructor(middlemap) {
    this.#middlewareMap = middlemap;
  }

  // the function that gets called when the routes is visited
  async call(req, res) {
    if (
      this.#middleware != null &&
      this.#middleware != undefined &&
      this.#middleware.length !== 0
    ) {
      let reqEditted = req;
      let resEdditted = res;

      // we loop throug all the middelware added to the route
      for (let i = 0; i < this.#middleware.length; i++) {
        const name = this.#middleware[i];

        // we make a variable next which we will set to true in the next function to
        // detect if the next function is called in the middelware.
        // that is done so we know if the user wants to continue.
        // the next function also changes the local req and res so the user can eddit them
        let called = false;
        let next = (req, res) => {
          called = true;
          (resEdditted = res), (reqEditted = req);
        };

        // check if it is the last index of the loop
        // if it is we change the next function
        if (i === this.#middleware.length - 1) {
          // we change the next function to no longer set the req and res
          // variables but call the this.callback function
          next = (req, res) => {
            called = true;
            this.callback(req, res);
          };
        }

        if (this.#middlewareMap.has(name)) {
          await this.#middlewareMap.get(name)(reqEditted, resEdditted, next);
        } else {
          console.error(`middleware: "${name}" not defined`);
        }
        // we check if the next function is called in the middelware
        // if next is not called we send errorcode 403 to signify an error
        if (!called) {
          res.statusCode = 403;
          res.end();
        }
      }
    } else {
      await this.callback(req, res);
    }

    // if the request isnt ended in the handeler we set
    // the httpcode to 403 and end the request
    if (!res.writeableEnded) {
      res.statusCode = 403;
      res.end();
    }
  }

  // when we set the middleware we need want to append the
  // name of the middelware instead of replacing it

  #pushMiddleware = (middlewareName) => {
    if (!this.#middleware.includes(middlewareName)) {
      this.#middleware.push(middlewareName);
    }
  };

  //add the middleware to the current middleware
  addMiddleware(name) {
    if (typeof name === "string") {
      this.#pushMiddleware(name);
    } else if (Array.isArray(name)) {
      name.forEach((item) => {
        this.#pushMiddleware(item);
      });
    }

    return this;
  }

  // set the middleware to just what has been defined
  // this function accepts a string or array which will both be cion
  set middleware(name) {
    this.#middleware = [];
    this.addMiddleware(name);
  }
}

module.exports = Route;
