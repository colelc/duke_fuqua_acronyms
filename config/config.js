const dotenv = require("dotenv");

dotenv.config();

const ENV = (process.env.ENV).toLowerCase().trim();
console.log("ENV is " + ENV);

const data = {
    //keyFile: ENV === "d" ? process.env.D_KEY_FILE : process.env.P_KEY_FILE,
    certFile: ENV === "d" ? process.env.D_CERT_FILE : process.env.P_CERT_FILE,
    certPassword: ENV === "d" ? process.env.D_CERT_FILE_PASSWORD : process.env.P_CERT_FILE_PASSWORD,
    
    httpsBaseUrl: ENV === "d" ? process.env.D_BASE_API_URL : process.env.P_BASE_API_URL,
    httpsApiPort: ENV === "d" ? process.env.D_HTTPS_API_PORT : process.env.P_HTTPS_API_PORT,

    //apiPort: ENV === "d" ? process.env.D_REST_API_PORT : process.env.P_REST_API_PORT,

    postgres: {
        host: ENV === "d" ? process.env.D_POSTGRES_HOST : process.env.P_POSTGRES_HOST,
        database: ENV === "d" ? process.env.D_POSTGRES_DATABASE : process.env.P_POSTGRES_DATABASE,
        user: ENV === "d" ? process.env.D_POSTGRES_USER : process.env.P_POSTGRES_USER,
        password: ENV === "d" ? process.env.D_POSTGRES_PASSWORD : process.env.P_POSTGRES_PASSWORD,
        port: ENV === "d" ? process.env.D_POSTGRES_PORT : process.env.P_POSTGRES_PORT
    }
};

module.exports = { data }