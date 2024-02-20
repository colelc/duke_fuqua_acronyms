
const express = require("express");
const router = express.Router();
const db = require("../db/postgres");
const { getAuthedClaims } = require("simple-jwt-auth");
const { getTokenFromHeaders } = require("simple-jwt-auth");
const logger = require("../logging/logger");

const getIdentity = ((request) => {

    logger.logIt(__filename, `getIdentity middleware doAuthentication: ${request.method} ${request.url}`);

    return getAuthedClaims({
        token: extractJWT(request.rawHeaders),
        issuer: "https://go.fuqua.duke.edu/auth",
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
   // logger.logIt(__filename, "fsb", fsb);
    return fsb;
});

// const getClaims = ((jwt) => {
//     try {
//         const pieces = jwt.split("\.");

//         if (pieces.length !== 3) {
//             throw new Error("Uh oh, not the right number of pieces in the JWT - there should be 3 (header, data, signature)");
//         }

//         const claimsString = (Buffer.from(pieces[1], "base64")).toString("utf8");
//         return JSON.parse(claimsString);
//     } catch(err) {
//         logger.logIt(__filename, "Something has gone wrong on the nodejs back end. Cannot authenticate user.", "error");
//         logger.logIt(__filename, err, "error");
//         return null;
//     }
// });

module.exports = { getIdentity }