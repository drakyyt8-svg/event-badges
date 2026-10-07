import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, createSignerFromKeypair, signerIdentity, publicKey } from '@metaplex-foundation/umi';
import { create, mplCore } from '@metaplex-foundation/mpl-core';
import { Redis } from '@upstash/redis';
import bs58 from 'bs58';

export const maxDuration = 30;

const mem = globalThis.__claims || (globalThis.__claims = new Set());
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

async function lock(key) {
  if (redis) return (await redis.set(key, '1', { nx: true })) === 'OK';
  if (mem.has(key)) return false;
  mem.add(key);
  return true;
}
async function unlock(key) {
  if (redis) await redis.del(key); else mem.delete(key);
}

export async function POST(req) {
  try {
    const { name, date, wallet } = await req.json();
    if (!name || !wallet) return Response.json({ error: 'Missing event name or wallet.' }, { status: 400 });
    let owner;
    try { owner = publicKey(wallet.trim()); }
    catch { return Response.json({ error: 'That is not a valid Solana address.' }, { status: 400 }); }

    const key = `claim:${name}|${date || ''}|${wallet.trim()}`;
    if (!(await lock(key))) return Response.json({ error: 'This wallet already claimed this badge.' }, { status: 409 });

    try {
      const umi = createUmi('https://api.devnet.solana.com').use(mplCore());
      const kp = umi.eddsa.createKeypairFromSecretKey(bs58.decode(process.env.FEE_PAYER_SECRET));
      umi.use(signerIdentity(createSignerFromKeypair(umi, kp)));
      const q = new URLSearchParams({ name, date: date || '' }).toString();
      const asset = generateSigner(umi);
      await create(umi, {
        asset,
        name: name.slice(0, 32),
        uri: `${new URL(req.url).origin}/api/meta?${q}`,
        owner,
      }).sendAndConfirm(umi);
      return Response.json({ asset: asset.publicKey.toString() });
    } catch (e) {
      await unlock(key);
      throw e;
    }
  } catch (e) {
    return Response.json({ error: 'Mint failed: ' + (e.message || e) }, { status: 500 });
  }
}
