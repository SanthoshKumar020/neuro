interface Device {
  id: string;
  name: string;
  status: 'on' | 'off';
}

let devices: Device[] = [
  { id: 'light-1', name: 'Living Room Light', status: 'off' },
  { id: 'light-2', name: 'Bedroom Light', status: 'on' },
  { id: 'thermostat-1', name: 'Main Thermostat', status: 'on' },
];

export async function controlDevice(deviceId: string, action: 'on' | 'off') {
  const device = devices.find(d => d.id === deviceId);
  if (device) {
    device.status = action;
    console.log(`[Smart Home] ${device.name} -> ${action}`);
    return { success: true, device };
  }
  return { success: false, message: 'Device not found' };
}

export async function getDevices() {
  return devices;
}

// A function to parse commands and control devices
export async function handleDeviceCommand(command: string) {
    const lowerCommand = command.toLowerCase();

    // Simple parsing logic
    const turnOn = lowerCommand.includes('turn on');
    const turnOff = lowerCommand.includes('turn off');

    if (turnOn || turnOff) {
        const action = turnOn ? 'on' : 'off';

        for (const device of devices) {
            if (lowerCommand.includes(device.name.toLowerCase())) {
                return await controlDevice(device.id, action);
            }
        }
    }

    return null;
}