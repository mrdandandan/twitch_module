import {API_URL} from './constants';
let request = require('request-promise');

let apiKey;
let uninitializedRequests = [];

// Used for requests that are 'made' before api has been initialized from twitch.  Upon API resolution from
//   twitch, all earlier requests are resolved.
function uninitializedRequest(path, query) {
    return new Promise((resolve, reject) => {
        let key = this;
        uninitializedRequests.push(function invoke() {
            API[key](path, query)
                .then(resolve);
        });
    });
}

let API = {
    users: uninitializedRequest.bind('users'),
    channels: uninitializedRequest.bind('channels'),
    search: uninitializedRequest.bind('search'),
    streams: uninitializedRequest.bind('streams'),
    ingests: uninitializedRequest.bind('ingests'),
    teams: uninitializedRequest.bind('teams')
};
let twitchRequest = {
    setApiKey
};

function _initialize() {
    let requestConfig = {
        uri: API_URL,
        headers: _apiRequestHeaders(),
        json: true
    };
    return request(requestConfig)
        .then(response => {
            for (let key in response._links) {
                if (!response._links.hasOwnProperty(key)) {
                    continue;
                }
                
                let link = response._links[key];
                if(['users', 'channels'].includes(key) && link[link.length - 1] !== 's') {
                    link += 's';
                }

                API[key] = _buildApiRequest(link);
            }
        });
}

function _buildApiRequest(url) {
    return function (path, query = {}) {
        if (path[0] === '/') {
            path = path.substr(1);
        }

        let requestConfig = {
            uri: `${url}/${path}`,
            headers: _apiRequestHeaders(),
            qs: query,
            json: true
        };

        return request(requestConfig);
    }
}

function _apiRequestHeaders() {
    return {
        'Client-ID': apiKey
    };
}

function setApiKey(key) {
    apiKey = key;
    _initialize()
        .then(() => {
            uninitializedRequests.forEach(_request => _request());
        });
}

export {
    twitchRequest
}

export default API