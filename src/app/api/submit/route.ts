import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Este es el cuerpo de la API Route que recibirá los datos del formulario.
export async function POST(request: Request) {
  const body = await request.json();
  console.log('Datos recibidos en /api/submit:', body);

  try {
    // 1. AUTENTICACIÓN
    // Las credenciales se tomarán desde las variables de entorno.
    // Asegúrate de haber creado el archivo .env.local y agregado las variables.
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 2. DATOS A AGREGAR
    // Mapeamos los datos recibidos a un formato de fila para Google Sheets.
    // El orden debe coincidir con el de tus columnas en la hoja de cálculo.
    const rows = body.map((response: any) => ([
      new Date().toISOString(), // Timestamp
      response.invitacionId,      // ID de la invitación
      response.paseNum,          // Número de pase
      response.nombre,            // Nombre del invitado
      response.asistencia,        // Respuesta de asistencia
      response.restriccion,       // Restricciones
      response.bebidas,           // Bebidas
    ]));

    // 3. ACCIÓN: AGREGAR LAS FILAS
    // Reemplaza SPREADSHEET_ID con el ID de tu hoja de Google Sheets.
    // Reemplaza 'Respuestas' con el nombre de la hoja específica (ej. 'Hoja1').
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Respuestas!A1', // Se agregará después de la última fila con datos en la hoja 'Respuestas'
      valueInputOption: 'USER_ENTERED', 
      requestBody: {
        values: rows,
      },
    });

    return NextResponse.json({ message: 'Confirmación enviada con éxito.' });

  } catch (error) {
    console.error('Error al enviar a Google Sheets:', error);
    // En caso de error, devolvemos un mensaje para que el usuario sepa que algo salió mal.
    return new NextResponse('Ocurrió un error al procesar la confirmación.', { status: 500 });
  }
}
