import React, { useState } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from './login.module.scss';

const fakeAuth = (username: string, password: string) => {
  return Promise.resolve('fake-jwt-token-' + btoa(username));
};

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const r = useRouter();
  const submit = async (e: any) => {
    e.preventDefault();
    const token = await fakeAuth(user, pass);
    localStorage.setItem('utt_jwt', token);
    r.push('/orders');
  };
  return (
    <div className={styles.card}>
      <h2>Sign in (mock)</h2>
      <form onSubmit={submit}>
        <label>Username</label>
        <input value={user} onChange={(e) => setUser(e.target.value)} className={styles.input} />
        <label>Password</label>
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          className={styles.input}
        />
        <button type="submit" className={styles.submitBtn}>
          Login
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale ?? 'en', ['common'])),
    },
  };
};
