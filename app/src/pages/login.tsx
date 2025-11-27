import React, {useState} from "react";
import {useRouter} from "next/router";

const fakeAuth = (username: string, password: string) => {
    return Promise.resolve("fake-jwt-token-" + btoa(username));
};

export default function Login() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const r = useRouter();
    const submit = async (e: any) => {
        e.preventDefault();
        const token = await fakeAuth(user, pass);
        localStorage.setItem("utt_jwt", token);
        r.push("/orders");
    };
    return (
        <div style={{maxWidth: 420, margin: "60px auto", background: "#fff", padding: 20, borderRadius: 8}}>
            <h2>Sign in (mock)</h2>
            <form onSubmit={submit}>
                <label>Username</label>
                <input value={user} onChange={(e) => setUser(e.target.value)}
                       style={{display: "block", width: "100%", padding: 8, marginBottom: 8}}/>
                <label>Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password"
                       style={{display: "block", width: "100%", padding: 8, marginBottom: 8}}/>
                <button type="submit" style={{padding: "8px 12px"}}>Login</button>
            </form>
        </div>
    );
}
