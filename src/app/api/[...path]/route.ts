import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STRIP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "content-length",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-for",
]);

const STRIP_RESPONSE_HEADERS = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "content-encoding",
  "content-length",
]);

async function proxy(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      { message: "API_URL is not configured on the server" },
      { status: 500 }
    );
  }

  const { path } = await ctx.params;
  const target = `${apiUrl.replace(/\/$/, "")}/${path.join("/")}${req.nextUrl.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!STRIP_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
    (init as RequestInit & { duplex: string }).duplex = "half";
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 502 }
    );
  }

  const respHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!STRIP_RESPONSE_HEADERS.has(key.toLowerCase())) {
      respHeaders.set(key, value);
    }
  });

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
export const HEAD = proxy;
