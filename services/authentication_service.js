const { getAuthedClaims } = require("simple-jwt-auth");
const { getTokenFromHeaders } = require("simple-jwt-auth");
const logger = require("../logging/logger");

const getIdentity = ((request, issuer) => {

    logger.logIt(__filename, `getIdentity middleware authentication: ${request.method} ${request.url}`);

    return getAuthedClaims({
        token: extractJWT(request.rawHeaders),
        //issuer: "https://go.fuqua.duke.edu/auth",
        issuer: issuer,
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

    // try getting JWT from _FSB_G
    const extracted = rawHeaders.filter((token) => {  return token.includes("_FSB_G");  });
    if (extracted.length !== 1) {
        logger.logIt(__filename, "Uh oh, We do not have the FSB anywhere in the raw headers", "error");
        return null;
    } 

    const fsbArray = (extracted[0].split(";")).filter((str) => {
        return str.includes("_FSB_G");
    });

    if (fsbArray.length !== 1) {
        logger.logIt(__filename, "Uh oh, no FSB string can be parsed", "error");
        return null;
    }
    
    const fsb = fsbArray[0].trim().replace("_FSB_G=", "");
    logger.logIt(__filename, `_FSB_G acquired`);
    return fsb;
});

module.exports = { getIdentity }