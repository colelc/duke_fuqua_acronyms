const config = require("./config/config");
const express = require("express")
const bodyParser = require("body-parser")
const https = require("node:https");
const fs = require("fs");
const fwAuth = require("./services/authentication_service")
const apiRoutes = require("./routes/api");
const path = require("path");
const logger = require("./logging/logger");

const app = express();

app.use(express.static("static"));

// middleware to intercept request - not sure if this is the best way to do it, but it works for now
app.use((request, response, next) => {
   fwAuth.getIdentity(request)
    .then(data => {
        request.identity = data;
        next();
     }).catch(err => {
        next();
        //response.status(401).send({err:`Cannot Authenticate`, statusCode: 401})
     });
});

// handle CORS - what changes for non-localhost?
app.use((request, response, next) => {
    //response.setHeader("Access-Control-Allow-Origin", ["https://localhost.fuqua.duke.edu:8443"]);
    response.setHeader("Access-Control-Allow-Origin", [config.data.httpsBaseUrl + ":" + config.data.originPort]);
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS, PATCH");
    response.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

// request body stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/api", apiRoutes);

app.get("/acronyms", (request, response) => {
    logger.logIt(__filename, `${request.method} ${request.url}`);
    response.sendFile(path.join(__dirname, "static/index.html"));
    //response.send("<h4>Acronyms Node.js backend HTTPS</h4>");
});

const options = {
    pfx: fs.readFileSync(config.data.certFile),
    passphrase: config.data.certPassword
  };

const server = https.createServer(options, app);

server.listen(config.data.httpsApiPort, () => {
    logger.logIt(__filename, `Listening on ${config.data.httpsBaseUrl}:${config.data.httpsApiPort}`);
});

