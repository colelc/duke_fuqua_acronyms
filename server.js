const config = require("./config/config");
//const debug = require("debug")("node-angular");
const express = require("express")
const bodyParser = require("body-parser")
//const path = require("path")
const https = require("node:https");
const fs = require("fs");

const app = express();

// handle CORS
app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS, PATCH");
    //response.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

// request body stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

app.get("/", (request, response) => {
    response.send("<h4>Acronyms Node.js backend HTTPS</h4>");
});

app.get("/test", (request, response) => {
    console.log(request.url);
    console.log(request.rawHeaders);
    response.send("<h4>TESTING Acronyms Node.js backend</h4>");
});

const options = {
    pfx: fs.readFileSync(config.data.certFile),
    passphrase: config.data.certPassword
  };


const server = https.createServer(options, app);

// const onListening = () => {
//     const addr = server.address();
//     const bind = typeof port === "string" ? "pipe " + config.data.httpsApiPort : "port " + config.data.httpsApiPort;
//     console.log("Listening on " + bind);
// };

// server.on("listening", onListening);

server.listen(config.data.httpsApiPort, () => {
    console.log(`Listening on ${config.data.httpsBaseUrl}:${config.data.httpsApiPort}`);
});

