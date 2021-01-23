const Route = require("./route.js");
const path = require("path");
const fs = require("fs");

class Router {
  #routes = {};
  #middleware = new Map();
  // add a route to the routes map with the correct method
  /********************* ROUTE FUNCTIONS *********************/
  addRoute(method, url, callback) {
    method = method.toUpperCase();

    // make sure the method exists
    this.#ensureMethod(method);

    // create a new route variable and set the callback method on it
    let route = new Route(this.#middleware);
    route.callback = callback;
    this.#routes[method].set(url, route);

    return route;
  }

  // get the handeler for the current route
  getRouteHandeler(method, url) {
    return this.#routes[method].get(url);
  }

  get routes() {
    let returnval = {};
    this.methods.forEach((methode) => {
      const keys = Array.from(this.#routes[methode].keys());
      returnval[methode] = keys;
    });
    return returnval;
  }
  /********************* METHOD FUNCTIONS *********************/
  // test if the routes obj has a certain method defined
  hasMethod(methode) {
    return this.methods.includes(methode);
  }

  #ensureMethod(method) {
    if (!this.hasMethod(method)) {
      this.#routes[method] = new Map();
    }
  }

  // get all the methods set in the routes obj
  get methods() {
    return Object.keys(this.#routes);
  }

  /********************* MIDDELWARE FUNCTIONS *********************/
  addMiddleware(name, middleware, override) {
    override = override ?? true;

    if (!override && global.middleware.has(name)) {
      throw new Error(`middleware with name: "${name}" already exists`);
    }
    this.#middleware.set(name, middleware);
  }

  loadMiddleware(middlewareFolder) {
    const normPath = path.join(process.cwd(), middlewareFolder);

    fs.readdirSync(normPath).forEach((file) => {
      const filename = file.split(".")[0];
      const handler = require(path.join(normPath, file));

      this.addMiddleware(filename, handler, false);
    });
  }
}

module.exports = Router;
