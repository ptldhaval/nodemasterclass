const environments = {
    staging:{
        port:3000,
        envName:"staging"
    },
    production:{
        port:5000,
        envName:"production"
    }
}

const currentEnvironment = typeof(process.env.NODE_ENV) ==='string' ? process.env.NODE_ENV.toLowerCase() : "staging";

module.exports = environments[currentEnvironment];

//run for production using below code
// NODE_ENV=production node .

//run for staging using below code
// NODE_ENV=staging node .
// OR JUST
// node .