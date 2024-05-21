import {
    useState,
    useCallback,
} from 'react';

import { InteractionType, PopupRequest } from '@azure/msal-browser';
import { useMsal, useMsalAuthentication } from "@azure/msal-react";

/**
 * Custom hook to call a web API using bearer token obtained from MSAL
 * @param {PopupRequest} msalRequest 
 * @returns 
 */
const useFetchWithMsal = (msalRequest) => {
    const { instance } = useMsal();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const { result, error: msalError } = useMsalAuthentication(InteractionType.Popup, {
        ...msalRequest,
        account: instance.getActiveAccount(),
        redirectUri: '/redirect'
    });

    /**
     * Execute a fetch request with the given options
     * @param {string} method: GET, POST, PUT, DELETE
     * @param {String} endpoint: The endpoint to call
     * @param {Object} data: The data to send to the endpoint, if any 
     * @returns JSON response
     */
    const execute = async (method, endpoint, data = null) => {
        if (msalError) {
            setError(msalError);
            return;
        }

        if (result) {
            try {
                let response = null;

                const headers = new Headers();
                const bearer = `Bearer ${result.accessToken}`;            
                headers.append("Authorization", bearer);

                //add apim key here
                const subscriptionKey = process.env.REACT_APP_APIM_SUBSCRIPTION;
                headers.append("Ocp-Apim-Subscription-Key", subscriptionKey);
                headers.append("Ocp-Apim-Trace", "true");

                if (data) headers.append('Content-Type', 'application/json');

                let options = {
                    method: method,
                    headers: headers,
                    body: data ? JSON.stringify(data) : null,
                };

                setIsLoading(true);
                response = await fetch(endpoint, options);
                if (response.ok) {
                    const text = await response.text();
                    /*let data;
                    try {
                        data = JSON.parse(text);
                    } catch (error) {
                        data = text;
                    }*/
                    const data = text ? JSON.parse(text) : {};
                    console.log("response:  ", data);
                    setData(data);
                    setIsLoading(false);
                    return data;
                } else {
                    throw new Error('Network response was not ok');
                }
                //response = await (await fetch(endpoint, options)).json();
                //console.log("response:  ", response);
                //setData(response);

                //setIsLoading(false);
                //return response;
            } catch (e) {
                setError(e);
                setIsLoading(false);
                throw e;
            }
        }
    };

    return {
        isLoading,
        error,
        data,
        execute: useCallback(execute, [result, msalError]), // to avoid infinite calls when inside a `useEffect`
    };
};

export default useFetchWithMsal;