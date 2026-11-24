import { useEffect, useState } from 'react'
import FlightViewport, { TargetPreview } from './FlightViewport'
import { missionFrame, offsets, stages, totalDuration } from './missionModel'
import './flight.css'
import './simulatorScene.css'

const number = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })
const targets = {
  'Blue Moon': {
    agency: 'Blue Origin',
    note: 'Cabina junto al puerto lateral. Orion se aproxima perpendicularmente al eje principal de Blue Moon.',
  },
  'Starship HLS': {
    agency: 'SpaceX',
    note: 'Fuselaje largo y puerto en la proa. Orion se alinea de frente con Starship.',
  },
}
type Target = keyof typeof targets

const sceneLabels = ['Plataforma', 'Plataforma', 'Ascenso', 'Separación', 'Órbita baja', 'Encuentro orbital', 'Alineación de puertos', 'Vehículos acoplados']

export default function Simulator() {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [target, setTarget] = useState<Target>('Blue Moon')
  const [angle, setAngle] = useState(0)
  const frame = missionFrame(time)
  const completed = frame.index === stages.length - 1
  const details = targets[target]

  useEffect(() => {
    if (!playing || completed) return
    let previous: number | undefined
    let renderTime: number | undefined
    let animation: number
    function tick(now: number) {
      if (previous === undefined) {
        previous = now
        renderTime = now
      }
      if (renderTime !== undefined && now - renderTime >= 33) {
        const seconds = Math.min(0.12, (now - previous) / 1000)
        setTime((current) => Math.min(totalDuration, current + seconds))
        previous = now
        renderTime = now
      }
      animation = requestAnimationFrame(tick)
    }
    animation = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animation)
  }, [playing, completed])

  const metrics = [
    ['Altitud', number.format(Math.round(frame.height)), 'km'],
    ['Velocidad orbital o de ascenso', number.format(Math.round(frame.speed)), 'm/s'],
    ['Reserva de impulso del modelo', number.format(Math.round(frame.fuel)), '%'],
    ['Distancia al objetivo', frame.range === null ? '—' : number.format(frame.range), 'm'],
    ['Velocidad relativa', frame.relative === null ? '—' : number.format(frame.relative), 'm/s'],
  ]

  function jump(index: number) {
    setTime(offsets[index])
    setPlaying(false)
  }

  return (
    <section className="artemis-flight-panel" aria-label="Simulador de misión espacial">
      <div className="artemis-flight-heading">
        <span className="artemis-flight-tag">Órbita terrestre baja · Simulación 3D</span>
        <label>Vehículo de prueba{' '}
          <select value={target} onChange={(event) => setTarget(event.currentTarget.value as Target)}>
            <option>Blue Moon</option>
            <option>Starship HLS</option>
          </select>
        </label>
      </div>
      <div className="artemis-simulator-scenes">
        <div className="artemis-flight-screen">
          <FlightViewport target={target} phase={frame.index} progress={frame.fraction} range={frame.range} />
          <span className="artemis-simulator-position">{sceneLabels[frame.index]}</span>
          {frame.index >= 4 && <span className="artemis-simulator-vehicles">Orion · {target}</span>}
          {frame.index === 1 && <output className="artemis-flight-countdown">T−{Math.ceil(frame.stage.duration * (1 - frame.fraction))}</output>}
        </div>
        <figure className="artemis-simulator-target">
          <figcaption aria-live="polite"><strong>{target}</strong><span>{details.agency} · Vehículo de prueba</span></figcaption>
          <TargetPreview target={target} angle={angle} />
          <p>{details.note}</p>
          <label>Girar modelo
            <input type="range" min="-3.14" max="3.14" step=".04" value={angle} onChange={(event) => setAngle(event.currentTarget.valueAsNumber)} />
          </label>
        </figure>
      </div>
      <div className="artemis-flight-status" aria-live="polite">
        <h3>{frame.stage.title}</h3>
        <p>{frame.stage.note}</p>
      </div>
      <dl className="artemis-flight-metrics">
        {metrics.map(([label, value, unit]) => <div key={label}><dt>{label}</dt><dd>{value} <small>{unit}</small></dd></div>)}
      </dl>
      <progress max={totalDuration} value={time} aria-label="Progreso de la misión" />
      <div className="artemis-flight-controls">
        <button type="button" className="artemis-flight-primary" onClick={() => {
          if (completed) {
            setTime(0)
            setPlaying(true)
          } else setPlaying(!playing)
        }}>{completed ? 'Volver a simular' : playing ? 'Pausar' : time > 0 ? 'Continuar' : 'Iniciar misión'}</button>
        <button type="button" onClick={() => jump(0)}>Reiniciar</button>
        <button type="button" disabled={frame.index === 0} onClick={() => jump(frame.index - 1)}>Etapa anterior</button>
        <button type="button" disabled={completed} onClick={() => jump(frame.index + 1)}>Siguiente etapa</button>
      </div>
      <ol className="artemis-flight-stages">
        {stages.map((stage, index) => <li key={stage.title}>
          <button type="button" aria-current={index === frame.index ? 'step' : undefined} onClick={() => jump(index)}>{stage.title}</button>
        </li>)}
      </ol>
      <p className="artemis-flight-caption">
        Modelos 3D ilustrativos sin escala técnica. La simulación usa tiempo comprimido y telemetría didáctica aproximada. Puedes ensayar un encuentro con cualquiera de los dos vehículos. En la secuencia anunciada el 23 de octubre de 2026, Orion se acoplaría primero a Blue Moon y después a Starship.{' '}
        <a href="https://www.nasa.gov/missions/artemis/nasa-shares-plans-to-accelerate-artemis-return-to-moon/">Actualización oficial de NASA</a>.
      </p>
    </section>
  )
}
