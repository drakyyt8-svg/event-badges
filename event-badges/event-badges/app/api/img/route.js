import { ImageResponse } from 'next/og';
export const runtime = 'edge';

export async function GET(req) {
  const p = new URL(req.url).searchParams;
  const name = p.get('name') || 'Event Badge';
  const date = p.get('date') || '';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1b1340', color: '#fff', padding: 60, textAlign: 'center' }}>
        <div style={{ display: 'flex', fontSize: 34, color: '#9fe8c1' }}>Proof of attendance</div>
        <div style={{ display: 'flex', fontSize: 60, fontWeight: 700, margin: '40px 0' }}>{name}</div>
        <div style={{ display: 'flex', fontSize: 34 }}>{date}</div>
      </div>
    ),
    { width: 600, height: 600 }
  );
}
