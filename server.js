const config = require("./config/config");
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

// use the routes
app.use("/acronyms", acronymRoutes);
app.use("/api", apiRoutes);

app.listen(config.data.apiPort, () => {
    console.log(`Server running on port ${config.data.apiPort}`);
});
