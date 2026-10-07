export async function GET(req) {
  const u = new URL(req.url);
  const name = u.searchParams.get('name') || 'Event Badge';
  const date = u.searchParams.get('date') || '';
  const image = `${u.origin}/api/img?${u.searchParams.toString()}`;
  return Response.json({
    name,
    symbol: 'BADGE',
    description: `Proof of attendance: ${name}${date ? ' on ' + date : ''}`,
    image,
    properties: { files: [{ uri: image, type: 'image/png' }], category: 'image' },
    attributes: [{ trait_type: 'Event', value: name }, { trait_type: 'Date', value: date }],
  }, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
