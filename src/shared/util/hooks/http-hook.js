import { useState, useCallback, useEffect } from "react";
import axios from "axios";

export const useHTTPClient = () => {
    const source = axios.CancelToken.source();
    const [isLoading, setLoading] = useState(false);
    const [hasError, setError] = useState();

    const sendRequest = useCallback(
        async (url, method = "get", body = null, authToken = null) => {
            try {
                setLoading(true);
                // const response = await axios({
                //     method,
                //     url,
                //     data: body
                // });
                const response = await axios({
                    url,
                    method,
                    data: body,
                    CancelToken: source.token,
                    headers: {
                        Authorization: "bearer " + authToken,
                        "Content-Type": "multipart/form-data",
                        "Content-Type": "application/json"
                    }
                });
                setLoading(false);
                return response.data;
            } catch (error) {
                setLoading(false);
                if (axios.isCancel(error)) {
                    console.log("Request is canceled", error.message);
                } else {
                    setError(error.response.data.message);
                    throw error;
                }
            }
        },
        []
    );

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        return () => {
            source.cancel("Maybe component unmounted, so cleaning up...");
        };
    }, []);

    return { isLoading, hasError, sendRequest, clearError };
};
