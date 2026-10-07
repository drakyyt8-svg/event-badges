export const metadata = { title: 'Event Badges on Solana', description: 'Free proof-of-attendance badges' };
const css = `
body{margin:0;font-family:system-ui,sans-serif;background:#f6f4ff;color:#1b1340}
main{max-width:480px;margin:0 auto;padding:32px 20px}
h1{font-size:28px;margin:0 0 8px}
input,button{display:block;width:100%;box-sizing:border-box;font-size:16px;padding:12px;margin:10px 0;border-radius:8px;border:1px solid #b9b0e6}
button{background:#1b1340;color:#fff;border:0;cursor:pointer}
button:disabled{opacity:.5}
.card{background:#fff;border-radius:12px;padding:20px;margin-top:20px;text-align:center;word-break:break-all}
.err{color:#b00020}
`;
export default function RootLayout({ children }) {
  return (<html lang="en"><body><style>{css}</style>{children}</body></html>);
}
