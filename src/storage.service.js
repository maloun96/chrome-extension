/*global chrome*/
export const set = (data, callback) => {
    chrome.storage.sync.set(data, callback);
};

export const get = (key, callback) => {
    chrome.storage.sync.get(key, (result) => callback(result[key]));
};


export default {set, get};
