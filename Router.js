const Route = require('./route.js')

class Router {
  #routes = {};
  addRoute(method, url, callback) {
    method = method.toUpperCase();
    if (! (method in this.#routes)) {
      this.#routes[method] = new Map();
    }

    let route = new Route(global.middleware);
    route.callback = callback;
    this.#routes[method].set(url, route);

    return route;
  }

  getRouteHandeler(method, url) {
      return this.#routes[method].get(url)
  }

  hasMethod(methode) {
      return (methode in Object.keys(this.#routes))
  }
}

module.exports = Router;
