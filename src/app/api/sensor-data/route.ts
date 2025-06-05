
import { type NextRequest, NextResponse } from 'next/server';

interface DeviceStatus {
  temperature: number | null;
  humidity: number | null;
  relay1ActualState: 'ON' | 'OFF' | null;
  relay2ActualState: 'ON' | 'OFF' | null;
  timestamp: Date | null;
}

let latestDeviceStatus: DeviceStatus = {
  temperature: null,
  humidity: null,
  relay1ActualState: null,
  relay2ActualState: null,
  timestamp: null,
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { temperature, humidity, relay1ActualState, relay2ActualState } = data;

    if (temperature === undefined || humidity === undefined || relay1ActualState === undefined || relay2ActualState === undefined) {
      return NextResponse.json({ message: 'Missing temperature, humidity, or relay state data' }, { status: 400 });
    }
    
    const isValidRelayState = (state: any) => state === 'ON' || state === 'OFF' || state === null;

    if (!isValidRelayState(relay1ActualState) || !isValidRelayState(relay2ActualState)) {
        if ((relay1ActualState !== null && (relay1ActualState !== 'ON' && relay1ActualState !== 'OFF')) ||
            (relay2ActualState !== null && (relay2ActualState !== 'ON' && relay2ActualState !== 'OFF'))) {
            return NextResponse.json({ message: 'Invalid relay state values. Must be ON or OFF if not null.' }, { status: 400 });
        }
    }

    latestDeviceStatus = {
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      relay1ActualState: relay1ActualState,
      relay2ActualState: relay2ActualState,
      timestamp: new Date(),
    };

    console.log(`Received device status: Temp=${latestDeviceStatus.temperature}, Hum=${latestDeviceStatus.humidity}, R1=${latestDeviceStatus.relay1ActualState}, R2=${latestDeviceStatus.relay2ActualState}`);

    return NextResponse.json({ message: 'Data received successfully', data: latestDeviceStatus }, { status: 200 });
  } catch (error) {
    console.error('Error processing device status:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}

export async function GET() {
  if (latestDeviceStatus.timestamp === null) {
    return NextResponse.json({
        message: 'No device data available yet.',
        temperature: null,
        humidity: null,
        relay1ActualState: null,
        relay2ActualState: null,
        timestamp: null
    }, { status: 200 });
  }
  return NextResponse.json(latestDeviceStatus, { status: 200 });
}
