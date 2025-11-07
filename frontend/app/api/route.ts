import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const per_pages = searchParams.get("per_pages");

  const response = await fetch(
    `${process.env.LARAVEL_API_URL}/barang?page=${page}&per_pages=${per_pages}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${process.env.LARAVEL_API_URL}/barang`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return Response.json(data);
}
