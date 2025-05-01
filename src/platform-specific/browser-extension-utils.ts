import { APIClient } from "../services/APIClient";

export class BrowserExtensionAdapter {

    static startListeningForMessages(clientSDK: APIClient, browser: any) {
        const handlers = getPrototypeMethodsOfClass(APIClient);

        browser.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
            const handler = handlers[message.type];
            if (handler) {
                try {
                    // @ts-ignore
                    const result = clientSDK[message.type](...message.arguments ?? []);
                    Promise.resolve(result).then(function (value) {
                        sendResponse({ success: true, result: value });
                    })
                } catch (error) {
                    sendResponse({ success: false, error: error });
                }
                //-- This is required by the browser runtime to indicate asyncronous response
                return true; 
            }
            sendResponse({ success: false, error: "Method not found on the APIClient" });
            return false;
        });
    }

    static createMessageSender(browser: any): any {
        const handlers = getPrototypeMethodsOfClass(APIClient);
        Object.keys(handlers).forEach(key => {
            handlers[key] = (...args: any[]) => {
                return new Promise((resolve, reject) => {
                    browser.runtime.sendMessage({ type: key, arguments: args }, (message: any) => {
                        if (!message?.success) {
                            console.error('Error', message?.error);
                            reject(message?.error);
                            return;
                        }
                        resolve(message.result);
                    });
                });
            }
        });

        return handlers;
    }
}


function getPrototypeMethodsOfClass(obj: any) {
    const proto = (obj.prototype);
    if (!proto) return [];
    return Object.getOwnPropertyNames(proto)
        .filter(prop => typeof proto[prop] === 'function' && prop !== 'constructor')
        .map(name => ([name, proto[name]]))
        .reduce((acc: any, [name, fn]) => {
            acc[name] = fn;
            return acc;
        }, {});
}