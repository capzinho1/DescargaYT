import { NextResponse } from "next/server";

export async function GET(request) {
  // 1. Recibimos el enlace directo oculto que nos manda el botón
  const searchParams = request.nextUrl.searchParams;
  const urlDirecta = searchParams.get("url");

  if (!urlDirecta) {
    return new NextResponse("Falta la URL del video", { status: 400 });
  }

  try {
    // 2. Railway descarga el video desde YouTube (usando su IP autorizada)
    const response = await fetch(urlDirecta);

    // 3. Railway te pasa el video a ti como si fuera un tubo continuo
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