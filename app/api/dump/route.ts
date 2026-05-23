export async function GET() {
  return Response.json({ ur: process.env.DATABASE_UR, url: process.env.DATABASE_URL });
}
