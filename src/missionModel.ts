export const stages = [
  {
    title: "Preparación",
    duration: 7,
    note: "La tripulación y el control de misión comprueban que los sistemas estén listos.",
  },
  {
    title: "Cuenta regresiva",
    duration: 10,
    note: "Se completa la secuencia previa al encendido en el Centro Espacial Kennedy.",
  },
  {
    title: "Despegue del SLS",
    duration: 12,
    note: "Los propulsores y la etapa central impulsan Orion fuera de la plataforma.",
  },
  {
    title: "Separación",
    duration: 14,
    note: "El lanzador descarta elementos agotados a medida que Orion se acerca a la órbita.",
  },
  {
    title: "Órbita terrestre baja",
    duration: 12,
    note: "Orion alcanza velocidad orbital. Las maniobras de fase ajustan su posición respecto al vehículo objetivo.",
  },
  {
    title: "Aproximación orbital",
    duration: 16,
    note: "Orion reduce la velocidad relativa y comprueba el corredor de aproximación al vehículo de prueba.",
  },
  {
    title: "Acoplamiento",
    duration: 12,
    note: "Orion alinea los puertos y avanza lentamente hasta el contacto y la captura.",
  },
  {
    title: "Demostración completada",
    duration: 0,
    note: "La prueba educativa concluye con los vehículos unidos en órbita terrestre.",
  },
] as const;

export const offsets = stages.map((_, i) =>
  stages.slice(0, i).reduce((sum, stage) => sum + stage.duration, 0),
);
export const totalDuration = offsets[offsets.length - 1];

const telemetry = [
  { height: 0, speed: 0, fuel: 100, range: null, relative: null },
  { height: 0, speed: 0, fuel: 100, range: null, relative: null },
  { height: 0, speed: 0, fuel: 100, range: null, relative: null },
  { height: 47, speed: 1400, fuel: 72, range: null, relative: null },
  { height: 195, speed: 6250, fuel: 27, range: null, relative: null },
  { height: 410, speed: 7665, fuel: 24, range: 3200, relative: 5.8 },
  { height: 410, speed: 7665, fuel: 22, range: 12, relative: 0.25 },
  { height: 410, speed: 7665, fuel: 21, range: 0, relative: 0 },
] as const;

export function missionFrame(time: number) {
  const nextIndex = offsets.findIndex((offset) => time < offset);
  const index = nextIndex === -1 ? offsets.length - 1 : nextIndex - 1;
  const stage = stages[index];
  const fraction = stage.duration
    ? Math.min(1, (time - offsets[index]) / stage.duration)
    : 0;
  const from = telemetry[index];
  const to = telemetry[index + 1] ?? from;
  const interpolate = (a: number, b: number) => a + (b - a) * fraction;
  let range: number | null = from.range;
  let relative: number | null = from.relative;
  if (
    from.range !== null &&
    to.range !== null &&
    from.relative !== null &&
    to.relative !== null &&
    stage.duration
  ) {
    // Hermite interpolation matches the closing speeds at each end of a phase.
    const physicalSeconds = index === 5 ? 900 : 96;
    const startSlope = -from.relative * physicalSeconds;
    const endSlope = -to.relative * physicalSeconds;
    const quadratic = 3 * (to.range - from.range) - 2 * startSlope - endSlope;
    const cubic = 2 * (from.range - to.range) + startSlope + endSlope;
    range = Math.max(
      0,
      from.range +
        fraction * (startSlope + fraction * (quadratic + fraction * cubic)),
    );
    relative = Math.max(
      0,
      -(startSlope + fraction * (2 * quadratic + fraction * 3 * cubic)) /
        physicalSeconds,
    );
  }
  return {
    index,
    stage,
    fraction,
    height: interpolate(from.height, to.height),
    speed: interpolate(from.speed, to.speed),
    fuel: interpolate(from.fuel, to.fuel),
    range,
    relative,
  };
}
