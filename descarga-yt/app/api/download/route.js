import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL no proporcionada" }, { status: 400 });
    }

    // Añadimos un "User-Agent" para parecer un navegador real y evitar el bloqueo de bot
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    
    // Comando con User-Agent y bypass de restricciones geográficas básicas
    const command = `yt-dlp "${url}" --dump-single-json --no-warnings --no-check-certificates --user-agent "${userAgent}" --geo-bypass`;
    
    const output = execSync(command).toString();
    const videoInfo = JSON.parse(output);

    return NextResponse.json({
      exito: true,
      titulo: videoInfo.title,
      miniatura: videoInfo.thumbnail,
      enlaceDirecto: videoInfo.url 
    });

  } catch (error) {
    console.error("Error real:", error.message);
    
    // Si sigue fallando por bot, daremos un mensaje más específico
    if (error.message.includes("confirm you’re not a bot")) {
      return NextResponse.json(
        { error: "YouTube bloqueó la conexión temporalmente. Intenta con otro video o espera unos minutos." }, 
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Error al procesar el video." }, 
      { status: 500 }
    );
  }
}