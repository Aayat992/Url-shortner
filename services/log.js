const winston = require('winston')
const logger = winston.createLogger({
    level:"info",
    format:winston.format.json(),
    defaultMeta :{
        service:"user-service"
    },
transports:[
    new winston.transports.File({filename:'error.log',level: "error"}),
     new winston.transports.File({filename:'info.log', level: "info"}),
      new winston.transports.File({filename:'http.log',level: "http"}),
]

})
module.exports = logger