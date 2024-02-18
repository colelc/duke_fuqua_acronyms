//const winston = require("winston")

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message,  filePath, timestamp }) => {
    return `${timestamp}  [${filePath}] ${level} ${message}`;
  });
  
const logger = createLogger({
    format: combine(
                    timestamp(),
                    logFormat
                    ),
    transports: [
                new transports.Console(),
                new transports.File({filename: "ACRONYMS.log", level: "info"})
            ]
  });


const logIt = (filePath,  message, level="info") => {
    console.log("level", level);
    logger.log({level: level, filePath: filePath, message: message});
};


module.exports = { /*logger,*/ logIt };
