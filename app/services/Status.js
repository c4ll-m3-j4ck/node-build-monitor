var request = require('../requests');
var https = require("https");


module.exports = function () {
    var self = this,
        log = function (text, debug) {
            if(debug) {
                console.log(new Date().toLocaleTimeString(), '|', text);
            }
        },
        makeRequest = function (url, callback) {
            request.makeRequest({
                url: url,
                headers: {
                    'Accept': '*/*',
                    'User-Agent': 'request'
                }
            }, callback);
        },
        getStatus = function (statusText) {
            if (statusText == "200") {
                return "Green"
            } else {
                return "Red";
            }
        },
        simplifyBuild = function (res) {
            return {
                id: '1000|2000',
                number: res.statusCode,
                project: self.configuration.name,
                definition: 'Status',
                isRunning: 'ok',
                statusText: res.statusMessage,
                status: getStatus(res.statusCode),
                url: self.configuration.url,
                hasErrors: false,
                hasWarnings: false
            };
        },
        queryBuilds = function (callback) {
            makeRequest(self.configuration.url, function (error, response, body) {
                if (error) {
                    callback(error);
                    return;
                }

                if (body.error) {
                    callback(new Error(body.error.message.value));
                    return;
                }

                var builds = [];

                builds.push(simplifyBuild(response));

                callback(error, builds);
            });
        };

    self.configure = function (config) {
        self.configuration = config;
    };

    self.check = function (callback) {
        queryBuilds(callback);
    };
};
