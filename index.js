const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
// custom classes

const Route = require("./route.js");

class HttpsServer {
  processRoot = process.cwd()
  public_folder = path.join(this.processRoot, 'public');
  routes = { GET: new Map(), POST: new Map() };
  mime_types = {
    html: "text/html",
    txt: "text/plain",
    css: "text/css",
    gif: "image/gif",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    js: "application/javascript",
  };
  #log = (val) => {
    if (this.debug) {
      console.log(val);
    }
  };

  #undefined = (variable) =>
    typeof variable === "undefined" || typeof variable === "null";

  constructor(options) {
    const { port, hostname, ssl, debug } = { ssl: {}, ...options };
    const { key, cert } = ssl;

    this.debug = this.#undefined(debug) ? false : true;
    this.hostname = this.#undefined(hostname) ? "localhost" : hostname;
    this.port = this.#undefined(port) ? "8080" : port;

    if (this.#undefined(key) || this.#undefined(cert)) {
      this.server = http.createServer((req, res) => {
        this.#handle_routes(req, res);
      });
    } else {
      this.server = https.createServer(
        {
          key: key,
          cert: cert,
        },
        (req, res) => {
          this.#handle_routes(req, res);
        }
      );
    }
  }

  listen(callback) {
    const call = () => {
      this.#log(`listening on port: ${this.port}`);
    };

    this.server.listen(this.port, this.hostname, (err) => {
      if (err) {
        console.error("Unable to listen to port", port, err);
        return;
      }
      call();
    });
  }

  #file_request_handeler(req, res) {
    const file_path = path.join(this.public_folder, req.url);

    // check if the requested file exists
    if (!fs.existsSync(file_path)) {
      res.statusCode = 404;
      return res.end();
    }

    const mimeType =
      this.mime_types[path.extname(file_path).slice(1)] || "text/plain";
    // open the file
    const fileStream = fs.createReadStream(file_path);
    fileStream.on("error", () => {
      res.setHeader("Content-Type", "text/plain");
      res.statusCode = 404;
    });

    fileStream.on("open", () => {
      // pipe the stream to the res stream
      res.setHeader("Content-Type", mimeType);
      fileStream.pipe(res);
    });
  }

  #parse_url(url) {
    const parts = url.split("?");

    const queryObj = {};
    if (parts.length > 1) {
      const queryParts = parts[1].split("&");

      for (let i = 0; i < queryParts.length; i++) {
        const pairs = queryParts[i].split("=");
        const key = pairs[0];
        pairs.shift();

        queryObj[key] = pairs.join("=");
      }
    }

    return {
      url: parts[0],
      queryParams: queryObj,
    };
  }

  // grab the correct function from the route handeler
  #handle_routes(req, res) {
    const { method, headers } = req;

    // const urlParts = req.url.toString().split('?')
    const urlParts = this.#parse_url(req.url);
    const url = urlParts.url;

    this.#log({ url: urlParts, method, hostname: headers.host });

    // handele favicon requests
    if (path.extname(url)) {
      return this.#file_request_handeler(req, res);
    }

    // check if the methode has been inplemented
    if (!(method in this.routes)) {
      res.statusCode = 405;
      res.end();
      return console.error(`methode: ${method} not implemented`);
    }
    const handeler = this.routes[method].get(url);
    // check if the route exist and if it does not send a 404
    if (typeof handeler === "undefined") {
      this.#log("route not found");
      res.statusCode = 404;
      return res.end();
    }

    req.on("error", (err) => {
      console.error(err);
    });

    // get the data in the request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      req.body = body;
      handeler.call(req, res);
    });
  }
  /********************* ROUTE FUNTIONS *********************/
  // the callback should take the varaibles req, res and the callback to the route which can be called
  // when the route has to be handeled. this function needs to get the req and res.
  get(path, callback) {
    return this.addRoute("GET", path, callback);
  }
  post(path, callback) {
    return this.addRoute("POST", path, callback);
  }

  addRoute(method, path, callback) {
    method = method.toUpperCase();
    if (method in this.routes) {
      this.routes[method] = new Map();
    }

    let route = new Route(this.#middleware);
    route.callback = callback;
    this.routes[method].set(path, route);

    return route;
  }

  /********************* MIDDELWARE FUNCTIONS *********************/
  #middleware = new Map();
  addMiddleware(name, middleware) {
    this.#middleware.set(name, middleware);
  }
  loadMiddleware(middlewareFolder) {
    const normPath = path.join(this.processRoot, middlewareFolder)

    fs.readdirSync(normPath).forEach((file) => {
      const filename = file.split('.')[0];
      const handler = require(path.join(normPath, file))

      this.#middleware.set(filename, handler)
    })
  }
  
  /********************* TEMPLATE RENDER FUNCTIONS *********************/
  // the user may implement his own render functions or renderer
  render(fileName, vals) {
    return this.renderEngine(
      fs.readFileSync(path.join(this.public_folder, fileName)).toString(),
      vals
    );
  }

  renderEngine = function (templateStr, params) {
    //TODO: change the scope of the object so we dont have to do params.varname in the template
    // make sure the params object is defined to a obj
    params = { ...params };
    
    // use eval to check the string
    let str = "";
    try {
      str = eval("`" + templateStr + "`");
    } catch (e) {
      str = e.toString();
    } finally {
      return str;
    }
  };
}
/********************* THIS IS THE END OF THE HTTPSERVER CLASS *********************/

module.exports = {HttpsServer, Route};
