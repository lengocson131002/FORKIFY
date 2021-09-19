import { async } from "regenerator-runtime";
import * as config from './config.js';


//THIS FILE CONTAINS ANY HELPER FUNCTION

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAX = async function (url, uploadData = undefined) {
    try {
        const fetchPro = uploadData ? fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData)
        }) : fetch(url);
        const response = await Promise.race([fetchPro, timeout(config.TIMEOUT_SEC)]);
        const data = await response.json();
        if (!response.ok) {
            // throw new Error(`${data.message}(${data.status})`);
            throw new Error(`${data.message}(${response.status})`);
        }
        return data;
    } catch (err) {
        throw err;
    }
};

/*
export const getJSON = async function (url) {
    try {
        const fetchPro = fetch(url);
        const response = await Promise.race([fetchPro, timeout(config.TIMEOUT_SEC)]);
        const data = await response.json();
        if (!response.ok) {
            // throw new Error(`${data.message}(${data.status})`);
            throw new Error(`${data.message}(${response.status})`);
        }
        return data;
    } catch (err) {
        throw err;
    }
};
export const sendJSON = async function (url, dataSent) {
    try {
        const fetchPro = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataSent)
        });
        const response = await Promise.race([fetchPro, timeout(config.TIMEOUT_SEC)]);
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            // throw new Error(`${data.message}(${data.status})`);
            throw new Error(`${data.message}(${response.status})`);
        }
        return data;
    } catch (err) {
        throw err;
    }
}
*/