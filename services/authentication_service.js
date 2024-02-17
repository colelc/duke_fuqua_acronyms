const doAuthentication = ((request) => {
    console.log(`doAuthentication: ${request.method} ${request.url}`);

    const jwt = extractJWT(request.rawHeaders);
    // console.log("-------------------------------------------------");
    // console.log("JWT", jwt);
    // console.log("-------------------------------------------------");

    if (jwt === null) {
        return null;
    }

    const claims = getClaims(jwt);
    console.log("claims", claims);
    return "";
});

const extractJWT = ((rawHeaders) => {
   // console.log("extractJWT", rawHeaders);

    let extracted = rawHeaders.filter((token) => {  return token.includes("_FSB_G");  });
    if (extracted.length !== 1) {
        console.log("Uh oh, We do not have the FSB anywhere in the raw headers");
        return null;
    } 

    const fsbArray = (extracted[0].split(";")).filter((str) => {
        return str.includes("_FSB_G");
    });

    if (fsbArray.length !== 1) {
        console.log("Uh oh, no FSB string can be parsed");
        return null;
    }
    
    const fsb = fsbArray[0].trim().replace("_FSB_G=", "");
   // console.log("fsb", fsb);
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
        console.log("Something has gone wrong on the nodejs back end. Cannot authenticate user.");
        console.log(err);
        return null;
    }
});


module.exports = { doAuthentication }