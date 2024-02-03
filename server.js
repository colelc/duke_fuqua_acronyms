const config = require("./config/config");
const debug = require("debug")("node-angular");
const express = require("express")
const app = express();

// include route file(s)
const acronymRoutes = require("./routes/acronyms");
const apiRoutes = require("./routes/api");

// inline route for basic hello world test
// http://localhost:3050/test
app.get("/test", (request, response) => {
    response.send("<h4>Acronyms Node.js backend</h4>");
});

const onListening = () => {
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe " + config.data.apiPort : "port " + config.data.apiPort;
    debug("Listening on " + bind);
  };

const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
};

app.on("listening", onListening);
app.on("error", onError);

// use the routes
app.use("/acronyms", acronymRoutes);
app.use("/api", apiRoutes);

app.listen(config.data.apiPort, () => {
    console.log(`Server running on port ${config.data.apiPort}`);
});
