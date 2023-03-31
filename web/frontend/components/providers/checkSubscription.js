import {useNavigate} from "react-router-dom";
import {useCallback} from "react";


export const CheckSubscription = useCallback(async (fetch) => {
    // const navigate = useNavigate();
    const url = `/api/media_icons/subscriptions/check`;
    const method = "GET";
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
    });
    if (response.ok) {
        console.log(response)
        const data = await response.json();
        const status = data.status
        if (status !== "active") {
            // navigate("/")
            console.log(status)
        }
    }
},[])