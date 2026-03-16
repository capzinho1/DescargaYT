import { NextResponse } from "next/server";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const urlDirecta = searchParams.get("url");

  if (!urlDirecta) {
    return new NextResponse("Falta la URL del video", { status: 400 });
  }

  try {
    // Railway descarga el video desde el link directo
    const response = await fetch(urlDirecta);

    // Te lo envía a ti como un archivo descargable
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "video/mp4",
        "Content-Disposition": 'attachment; filename="Video_Descargado.mp4"',
      },
    });
  } catch (error) {
    console.error("Error en el proxy:", error);
    return new NextResponse("Error al transferir el video", { status: 500 });
  }
}