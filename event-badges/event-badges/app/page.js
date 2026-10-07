'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [link, setLink] = useState('');
  const make = () => {
    if (!name.trim()) return;
    setLink(`${location.origin}/claim?` + new URLSearchParams({ name: name.trim(), date }).toString());
  };
  return (
    <main>
      <h1>Event badges on Solana</h1>
      <p>Create a badge for your event. Attendees scan the QR code and claim it for free.</p>
      <input placeholder="Event name" value={name} maxLength={32} onChange={(e) => setName(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button onClick={make}>Create QR code</button>
      {link && (
        <div className="card">
          <QRCodeSVG value={link} size={240} />
          <p><a href={link}>{link}</a></p>
        </div>
      )}
    </main>
  );
}
