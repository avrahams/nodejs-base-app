process.env.VCAP_SERVICES = (process.env.VCAP_SERVICES) ? process.env.VCAP_SERVICES : JSON.stringify(require("vcap.json"));

