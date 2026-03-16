import { NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL no proporcionada" }, { status: 400 });
    }

    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    
    // 1. Buscamos la ruta absoluta y exacta donde Railway guardó yt-dlp
    const ytdlpPath = path.join(process.cwd(), 'yt-dlp');
    
    // 2. Usamos esa ruta exacta en el comando
    const command = `"${ytdlpPath}" "${url}" --dump-single-json --no-warnings --no-check-certificates --user-agent "${userAgent}" --geo-bypass`;
    
    const output = execSync(command).toString();
    const videoInfo = JSON.parse(output);

    return NextResponse.json({
      exito: true,
      titulo: videoInfo.title,
      miniatura: videoInfo.thumbnail,
      enlaceDirecto: videoInfo.url 
    });

  } catch (error) {
    // 3. Capturamos el error REAL y lo enviamos a tu pantalla para leerlo
    console.error("Error en Railway:", error.message);
    return NextResponse.json(
      { error: "Detalle del error: " + error.message }, 
      { status: 500 }
    );
  }
}