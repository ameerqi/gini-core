(function () {
    const LOG_TAG = "[QiMiniAppEngine]";
    const callbacks = {};

    function postMessage(name, callback, payload) {
        const uuid = generateUUID();
        callbacks[uuid] = callback;

        if (window.QiProxy) {
            window.QiProxy.postMessage(name, uuid, JSON.stringify(payload));
        } else if (typeof webkit !== 'undefined' && webkit && webkit.messageHandlers && webkit.messageHandlers.qi) {
            webkit.messageHandlers.qi.postMessage({
                name,
                uuid,
                payload,
                version: window.qi.version,
            });
        } else {
            console.log(LOG_TAG, "Not running inside the app!");
        }
    }

    function postMessageReply(uuid, payload) {
        const callback = callbacks[uuid];
        if (callback) {
            try {
                callback(payload);
            } catch (err) {
                console.log(LOG_TAG, `Caught error on executing callback function uuid: ${uuid}, data: ${JSON.stringify(payload)}`)
            } finally {
                delete callbacks[uuid];
            }
        } else {
            console.log(LOG_TAG, `Got reply UUID: "${uuid}" but no callback registered, data: ${JSON.stringify(payload)}`)
        }
    }

    window.qi = {
        version: 2,
        postMessageReply,
        setEventHandler: (event, callback) => {},
        removeEventHandler: (event) => {},
        isMiniApp: () => window.QiProxy || (typeof webkit !== 'undefined' && webkit && webkit.messageHandlers && webkit.messageHandlers.qi),

        purchase: (options, callback) => postMessage("purchase", callback, {
            price: options.price,
            merchantTransactionID: options.merchantTransactionID,
            description: "",
            costBreakdown: [],
            timeToLiveMillis: 10_000 * 60,
        }),
        openURL: (options, callback) => postMessage('open-url', callback, options),

        getAccount: (callback) => {
            postMessage("get-account", (data) => {
                if (isJWT(data.token)) {
                    const parsedJWT = parseJWT(data.token);

                    callback({
                        status: data.status,
                        account: {
                            token: data.token,
                            value: parsedJWT["accountNumber"],
                        },
                    });
                } else {
                    callback({
                        status: data.status,
                        account: null,
                    });
                }
            })
        },
        readQr: (callback) => postMessage("read-qr", callback),
        getLocation: (callback) => postMessage("get-location", callback),
        close: () => postMessage("close", () => {})
    };

    function generateUUID() {
        // Public Domain/MIT
        let d = new Date().getTime(); //Timestamp
        let d2 =
            (typeof performance !== "undefined" &&
                performance.now &&
                performance.now() * 1000) ||
            0; //Time in microseconds since page-load or 0 if unsupported
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                let r = Math.random() * 16; //random number between 0 and 16
                if (d > 0) {
                    //Use timestamp until depleted
                    r = (d + r) % 16 | 0;
                    d = Math.floor(d / 16);
                } else {
                    //Use microseconds since page-load if supported
                    r = (d2 + r) % 16 | 0;
                    d2 = Math.floor(d2 / 16);
                }
                return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
            },
        );
    }

    function isJWT(token) {
        return !!token && token.split(".").length === 3;
    }

    function parseJWT(token) {
        const parts = token.split(".");
        if (parts.length !== 3) { return null; }
        return JSON.parse(atob(parts[1]));
    }

    /* Initializers */
    const params = new URLSearchParams(window.location.search);

    const userDataJWT = params.get("userData");
    if (userDataJWT && isJWT(userDataJWT)) {
        const parsedJWT = parseJWT(userDataJWT);
        window.qi.user = {
            mobile: {
                token: userDataJWT,
                value: parsedJWT["mobile"]
            }
        }
    }

    const appDataString = params.get("appData");
    if (appDataString) {
        const appData = JSON.parse(appDataString)
        window.qi.app = {
            language: appData.language,
            platform: appData.platform,
            theme: appData.theme,
            version: appData.version
        }
    }

    window.onerror = function (message, url, lineNumber) {
        console.log(`Caught error (${message}) on line: ${lineNumber}`);
    }
})();