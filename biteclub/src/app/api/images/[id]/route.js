import { getImageById } from '@/lib/db/dbOperations';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const image = await getImageById(id);

    return new Response(JSON.stringify(image), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Image not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
