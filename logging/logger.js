//const winston = require("winston")

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message,  filePath, timestamp }) => {
    return `${timestamp}  [${filePath}] ${level} ${message}`;
  });
  
const logger = createLogger({
    format: combine(
                   // label({ label: "right meow!" }),
                    timestamp(),
                    logFormat
                    ),
    transports: [new transports.Console()]
  });

// logger.add(new winston.transports.Console({
//     format: `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//}));

const logIt = (filePath, message) => {
    logger.log({level: "info", filePath: filePath, message: message});
};


module.exports = { logger, logIt };
