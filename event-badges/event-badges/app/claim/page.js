'use client';
import { useEffect, useState } from 'react';

export default function Claim() {
  const [ev, setEv] = useState({ name: '', date: '' });
  const [wallet, setWallet] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setEv({ name: p.get('name') || '', date: p.get('date') || '' });
  }, []);

  const connect = async () => {
    try {
      const r = await window.solana.connect();
      setWallet(r.publicKey.toString());
    } catch {
      setMsg('Could not connect Phantom. Paste your wallet address instead.');
    }
  };

  const claim = async () => {
    setBusy(true); setMsg('');
    try {
      const r = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ev, wallet }),
      });
      const d = await r.json();
      if (d.asset) setDone(d.asset); else setMsg(d.error || 'Something went wrong.');
    } catch { setMsg('Network error. Try again.'); }
    setBusy(false);
  };

  if (!ev.name) return <main><p>This claim link is missing the event name.</p></main>;
  return (
    <main>
      <h1>{ev.name}</h1>
      <p>{ev.date}</p>
      {done ? (
        <div className="card">
          <p>Badge claimed! Check your wallet on devnet.</p>
          <a href={`https://explorer.solana.com/address/${done}?cluster=devnet`}>View your badge</a>
        </div>
      ) : (
        <>
          <button onClick={connect}>Connect Phantom</button>
          <input placeholder="or paste your Solana wallet address" value={wallet} onChange={(e) => setWallet(e.target.value)} />
          <button onClick={claim} disabled={busy || !wallet}>{busy ? 'Minting...' : 'Claim badge'}</button>
          {msg && <p className="err">{msg}</p>}
        </>
      )}
    </main>
  );
}
