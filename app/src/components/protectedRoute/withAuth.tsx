import React, { ComponentType, FC } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const WithAuth: FC<P> = (props) => {
        const router = useRouter();
        useEffect(() => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("utt_jwt");
                if (!token) router.replace("/login");
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };
    return WithAuth;
};

export default withAuth;
