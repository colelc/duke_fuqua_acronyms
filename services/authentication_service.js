const config = require("../config/config");
const { getAuthedClaims } = require("simple-jwt-auth");
const { getTokenFromHeaders } = require("simple-jwt-auth");
const logger = require("../logging/logger");

const getIdentity = ((request) => {

    logger.logIt(__filename, `getIdentity middleware authentication: ${request.method} ${request.url}`);

    return getAuthedClaims({
        token: extractJWT(request.rawHeaders),
        //issuer: "https://go.fuqua.duke.edu/auth",
        issuer: config.data.issuer,
        audience: "FuquaWorld"
    });
});

const extractJWT = ((rawHeaders) => {
   // logger.logIt(__filename, "extractJWT", rawHeaders);

   // try getting JWT from Authorization header first
   const token = getTokenFromHeaders({  headers: "Authorization" });
   logger.logIt(__filename, `getTokenFromHeaders returns ${token}`)

   if (token !== null) {
    return token;
   }

    // try getting JWT from cookie
    const extracted = rawHeaders.filter((token) => {  return token.includes(config.data.cookieName);  });
    if (extracted.length !== 1) {
        logger.logIt(__filename, "Uh oh, We do not have the FSB anywhere in the raw headers", "error");
        return null;
    } 

    const cookieArray = (extracted[0].split(";")).filter((str) => {
        return str.includes(config.data.cookieName);
    });

    if (cookieArray.length !== 1) {
        logger.logIt(__filename, `Uh oh, no ${config.data.cookieName} string can be parsed`, "error");
        return null;
    }
    
    const cookie = cookieArray[0].trim().replace(config.data.cookieName+"=", "");
    logger.logIt(__filename, `${config.data.cookieName} acquired`);
    return cookie;
});

module.exports = { getIdentity }