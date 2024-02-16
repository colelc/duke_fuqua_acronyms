const doAuthentication = ((request) => {
    console.log(`doAuthentication: ${request.method} ${request.url}`);
    //console.log(request.rawHeaders);
    const jwt = extractJWT(request.rawHeaders);
    console.log("JWT", jwt);
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


module.exports = { doAuthentication }