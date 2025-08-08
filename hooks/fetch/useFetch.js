import { useEffect } from 'react';
import { useState } from 'react';

export default function useFetch  (url, method = 'GET', body = null) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchData = async() => {
        try {
            const options = {
                method,
                credentials: 'include',
                headers: {
                        'Content-Type': 'application/json',
                    },
                    signal,
                };

                if (body && method !== 'GET') {
                    options.body = JSON.stringify(body);
                }

                const res = await fetch(url, options);
                if (!res.ok){
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const json = await res.json();
                setData(json);
            } catch(e) {
                setError(`${e.message}`);
            } finally {
                setLoading(false);
            }
    }

    useEffect(() => {
        fetchData();
    },[url,method,body])

    return {data,loading,error};
}

