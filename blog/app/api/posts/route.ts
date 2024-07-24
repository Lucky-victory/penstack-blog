export const dynamic = 'force-dynamic'

export default async function POST(req: Request) {
  const { title, content } = await req.json()

  return new Response(JSON.stringify({ title, content }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}