import {useEffect} from "react";
import {useRouter} from "next/router";

export default function Home() {
    const r = useRouter();
    useEffect(() => {
        r.replace("/orders");
    }, [r]);
    return <div>Redirecting to /orders...</div>;
}
