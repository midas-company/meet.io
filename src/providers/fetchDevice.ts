type fetchDeviceType = {
  device: string;
  output?: boolean;
};

export default async function fetchDevice({ device, output }: fetchDeviceType) {
  const deviceStream = await navigator.mediaDevices.getUserMedia({
    [device]: true,
  });

  const deviceEnumerated = await navigator.mediaDevices.enumerateDevices();

  const deviceInfo = deviceEnumerated
    .filter((d) => d.kind === `${device}${output ? "output" : "input"}`)
    .map((d) => ({
      label: d.label,
      value: d.deviceId,
    }));

  return { deviceStream, deviceInfo };
}
