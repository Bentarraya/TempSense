
import { type NextRequest, NextResponse } from 'next/server';

interface SensorData {
  temperature: number | null;
  humidity: number | null;
  timestamp: Date | null;
}

// Variabel untuk menyimpan data sensor terakhir di memori server
let latestSensorData: SensorData = {
  temperature: null,
  humidity: null,
  timestamp: null,
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { temperature, humidity } = data;

    if (temperature === undefined || humidity === undefined) {
      return NextResponse.json({ message: 'Missing temperature or humidity data' }, { status: 400 });
    }

    // Update data sensor terakhir
    latestSensorData = {
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      timestamp: new Date(),
    };

    console.log(`Received sensor data: Temperature=${latestSensorData.temperature}, Humidity=${latestSensorData.humidity}`);

    // Kirim respons sukses
    return NextResponse.json({ message: 'Data received successfully', data: latestSensorData }, { status: 200 });
  } catch (error) {
    console.error('Error processing sensor data:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}

export async function GET() {
  if (latestSensorData.temperature === null || latestSensorData.humidity === null) {
    return NextResponse.json({ message: 'No sensor data available yet.', temperature: null, humidity: null, timestamp: null }, { status: 200 });
  }
  return NextResponse.json(latestSensorData, { status: 200 });
}
