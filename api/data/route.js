import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const data = await kv.get('oniscenary_data') || [];
    return Response.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return Response.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await kv.set('oniscenary_data', data);
    return Response.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    return Response.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
