
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { temperature, humidity } = data;

    if (temperature === undefined || humidity === undefined) {
      return NextResponse.json({ message: 'Missing temperature or humidity data' }, { status: 400 });
    }

    // Untuk saat ini, kita hanya akan log data yang diterima
    // Ke depannya, data ini bisa disimpan ke database
    console.log(`Received sensor data: Temperature=${temperature}, Humidity=${humidity}`);

    // Kirim respons sukses
    return NextResponse.json({ message: 'Data received successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Error processing sensor data:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}

// Handler untuk metode HTTP lain jika diperlukan di masa mendatang
export async function GET() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests for sensor data.' }, { status: 405 });
}
