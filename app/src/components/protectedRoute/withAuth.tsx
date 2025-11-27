// HOC that checks localStorage for token
import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent: any) => {
    return (props: any) => {
        // This runs client-side
        const router = useRouter();
        useEffect(() => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("utt_jwt");
                if (!token) router.replace("/login");
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
