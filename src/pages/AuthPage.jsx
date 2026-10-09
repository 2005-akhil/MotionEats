import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setMessage(''); setBusy(true);
    try {
      const res = await fetch(`${API}/api/auth/${mode === 'login' ? 'login' : 'register'}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      localStorage.setItem('motioneats_user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) { setMessage(err.message); } finally { setBusy(false); }
  };

  return <main className={styles.main}><div className={styles.card}>
    <Link to="/" className={styles.back}>← MotionEats</Link>
    <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
    <p className={styles.sub}>{mode === 'login' ? 'Log in to your MotionEats account.' : 'Your account is stored securely in MongoDB.'}</p>
    <form onSubmit={submit}>
      {mode === 'register' && <label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></label>}
      <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></label>
      <label>Password<input type="password" minLength="6" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></label>
      {message && <p className={styles.error}>{message}</p>}
      <button disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}</button>
    </form>
    <button className={styles.switch} onClick={()=>{setMode(mode==='login'?'register':'login');setMessage('')}}>
      {mode === 'login' ? 'Need an account? Create one' : 'Already have an account? Log in'}
    </button>
  </div></main>;
}
