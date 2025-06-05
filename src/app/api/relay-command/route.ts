
import { type NextRequest, NextResponse } from 'next/server';

interface RelayCommands {
  relay1Command: 'ON' | 'OFF';
  relay2Command: 'ON' | 'OFF';
  lastCommandTimestamp: Date | null;
}

let currentRelayCommands: RelayCommands = {
  relay1Command: 'OFF',
  relay2Command: 'OFF',
  lastCommandTimestamp: null,
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { relayId, command } = data; 

    if (!relayId || !command) {
      return NextResponse.json({ message: 'Missing relayId or command' }, { status: 400 });
    }
    if (!['ON', 'OFF'].includes(command)) {
        return NextResponse.json({ message: 'Invalid command value. Must be ON or OFF.' }, { status: 400 });
    }

    if (relayId === 'relay1') {
      currentRelayCommands.relay1Command = command;
    } else if (relayId === 'relay2') {
      currentRelayCommands.relay2Command = command;
    } else {
      return NextResponse.json({ message: 'Invalid relayId. Must be "relay1" or "relay2".' }, { status: 400 });
    }
    currentRelayCommands.lastCommandTimestamp = new Date();

    console.log('Received relay command. New desired states:', currentRelayCommands);
    return NextResponse.json({ message: 'Relay command received and processed', commands: currentRelayCommands }, { status: 200 });
  } catch (error) {
    console.error('Error processing relay command:', error);
     if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(currentRelayCommands, { status: 200 });
}
