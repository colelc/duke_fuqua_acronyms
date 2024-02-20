const config = require("./config/config");
const express = require("express")
const bodyParser = require("body-parser")
const https = require("node:https");
const fs = require("fs");
const fwAuth = require("./services/authentication_service")
const logger = require("./logging/logger");

const app = express();

// middleware to intercept request
app.use((request, response, next) => {
   fwAuth.getIdentity(request, config.data.issuer)
        .then(data => {
        request.identity = data;
        next();
     }).catch(err => {
         next();
     });
});

// handle CORS
const allowedOrigin = config.data.httpsBaseUrl + ":" + config.data.originPort;

app.use((request, response, next) => {
    //response.setHeader("Access-Control-Allow-Origin", ["https://localhost.fuqua.duke.edu:8443"]);
    response.setHeader("Access-Control-Allow-Origin", [allowedOrigin]);
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS, PATCH");
    response.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

// request body stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

app.get("/", (request, response) => {
    logger.logIt(__filename, `${request.method} ${request.url}`);
    response.send("<h4>Acronyms Node.js backend HTTPS</h4>");
});

app.get("/test", (request, response) => {
    logger.logIt(__filename, `${request.method} ${request.url}`);
    response.send("<h4>TESTING Acronyms Node.js backend</h4>");
});

const options = {
    pfx: fs.readFileSync(config.data.certFile),
    passphrase: config.data.certPassword
  };


const server = https.createServer(options, app);

server.listen(config.data.httpsApiPort, () => {
    logger.logIt(__filename, `Listening on ${config.data.httpsBaseUrl}:${config.data.httpsApiPort}`);
});

