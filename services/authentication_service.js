
const express = require("express");
const router = express.Router();
const db = require("../db/postgres");
const { getAuthedClaims } = require("simple-jwt-auth");
const logger = require("../logging/logger");

//const { getAuthedClaims } = require("simple-jwt-auth");

// const getIdentity2 = ((request) => {
//     logger.logIt(__filename, `getIdentity2 middleware doAuthentication: ${request.method} ${request.url}`);

//     const claims = getAuthedClaims({
//         tokens: extractJWT(request.rawHeaders),
//         issuer: "go.fuqua.duke.edu",
//         audience: ""
//     });

//     logger.logIt(__filename, "CLAIMS");
//     logger.logIt(__filename, claims);
// });

const getIdentity = ((request) => {
    //logger.logIt(__filename, `middleware doAuthentication: ${request.method} ${request.url}`);

    if (request.method === "OPTIONS") {
        return;
    }

    if (request.url.includes("favicon")) {
        return;
    }

    const jwt = extractJWT(request.rawHeaders);
    // logger.logIt(__filename, "-------------------------------------------------");
    // logger.logIt(__filename, "JWT", jwt);
    // logger.logIt(__filename, "-------------------------------------------------");

    if (jwt === null) {
        return;
    }

    const identity = getClaims(jwt);
    if (identity === null) {
        return;
    }

    // Extract dukeId - put it in the request
    //request.dukeId = identity.dukeid;
    request.identity = identity;
    logger.logIt(__filename, `${request.method} ${request.url}  dukeid=${request.identity.dukeid}`);
    //logger.logIt(__filename, "request.identity", request.identity);
   // return identity;
});

const extractJWT = ((rawHeaders) => {
   // logger.logIt(__filename, "extractJWT", rawHeaders);

    let extracted = rawHeaders.filter((token) => {  return token.includes("_FSB_G");  });
    if (extracted.length !== 1) {
        logger.logIt(__filename, "Uh oh, We do not have the FSB anywhere in the raw headers");
        return null;
    } 

    const fsbArray = (extracted[0].split(";")).filter((str) => {
        return str.includes("_FSB_G");
    });

    if (fsbArray.length !== 1) {
        logger.logIt(__filename, "Uh oh, no FSB string can be parsed");
        return null;
    }
    
    const fsb = fsbArray[0].trim().replace("_FSB_G=", "");
   // logger.logIt(__filename, "fsb", fsb);
    return fsb;
});

const getClaims = ((jwt) => {
    try {
        const pieces = jwt.split("\.");

        if (pieces.length !== 3) {
            throw new Error("Uh oh, not the right number of pieces in the JWT - there should be 3 (header, data, signature)");
        }

        const claimsString = (Buffer.from(pieces[1], "base64")).toString("utf8");
        return JSON.parse(claimsString);
    } catch(err) {
        logger.logIt(__filename, "Something has gone wrong on the nodejs back end. Cannot authenticate user.");
        logger.logIt(__filename, err);
        return null;
    }
});

module.exports = { getIdentity }