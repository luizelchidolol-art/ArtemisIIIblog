import { useEffect, useRef } from 'react'
import { orbitGeometry, projectFlight, rocketGeometry, targetGeometry } from './flightScene'

type Target = 'Blue Moon' | 'Starship HLS'
type Props = { target: Target; phase: number; progress: number; range: number | null }
const width = 640
const height = 320

function paint(canvas: HTMLCanvasElement, faces: ReturnType<typeof projectFlight>) {
  const context = canvas.getContext('2d')
  if (!context) return
  context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0)
  context.clearRect(0, 0, width, height)
  for (const { points, color, shade } of faces) {
    context.beginPath()
    points.forEach(({ x, y }, i) => { if (i === 0) context.moveTo(x, y); else context.lineTo(x, y) })
    context.closePath()
    context.fillStyle = color
    context.fill()
    context.strokeStyle = color
    context.lineWidth = 0.65
    context.stroke()
    context.fillStyle = shade
    context.fill()
  }
}

export function TargetPreview({ target, angle }: { target: Target; angle: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvas.current) return
    const blue = target === 'Blue Moon'
    paint(canvas.current, projectFlight(targetGeometry(target), { width, height, azimuth: angle + (blue ? 0.04 : -0.25), elevation: -0.18, scale: 2.35 }))
  }, [target, angle])
  return <canvas ref={canvas} width="960" height="480" aria-hidden="true" />
}

export default function FlightViewport({ target, phase, progress, range }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const orbit = phase >= 4
  const flight = phase === 2 || phase === 3
  const rise = phase === 2 ? 0.05 + 0.76 * progress : phase === 3 ? 0.81 + 0.19 * progress : 0
  const separation = phase === 3 ? progress : 0
  const path = phase === 4 ? 155 - 55 * progress : Math.min(99, 99 * Math.sqrt((range ?? 3200) / 3200))
  const alignment = phase < 7 ? Math.min(20, Math.sqrt(range ?? 3200) * 0.34) : 0

  useEffect(() => {
    if (!canvas.current) return
    const mesh = orbit ? orbitGeometry(target, path, alignment) : rocketGeometry(separation)
    const camera = orbit
      ? { azimuth: -0.26, elevation: 0.3, scale: 1.47, offsetX: 50, offsetY: -42 }
      : { azimuth: 0.46, elevation: 0.13, scale: 1.22 - rise * 0.53, offsetY: 18 - rise * 66 }
    paint(canvas.current, projectFlight(mesh, { width, height, ...camera }))
  }, [target, separation, orbit, path, alignment, rise])

  const base = 265 - rise * 110
  return (
    <div className={`artemis-flight-viewport ${orbit ? 'artemis-flight-viewport-orbit' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 640 320" preserveAspectRatio="none">
        <defs>
          <linearGradient id="flight-earth" x2="0" y2="1">
            <stop stopColor="#5b94c7" /><stop offset=".43" stopColor="#2b5293" /><stop offset="1" stopColor="#071326" />
          </linearGradient>
          <linearGradient id="flight-sky" x2="0" y2="1">
            <stop stopColor="#0b1831" stopOpacity="0" /><stop offset="1" stopColor="#678cbf" stopOpacity=".38" />
          </linearGradient>
          <linearGradient id="flight-exhaust" x2="0" y2="1">
            <stop stopColor="#fffbea" /><stop offset=".35" stopColor="#ffad52" /><stop offset="1" stopColor="#ff4d30" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 61 }, (_, i) => (
          <circle key={i} cx={(i * 97 + 23) % 640} cy={(i * 79 + 11) % 318} r={i % 7 === 0 ? 1.2 : 0.57} fill="#d4e7ff" opacity={0.14 + (i % 8) / 14} />
        ))}
        {orbit ? <>
          <ellipse cx="339" cy="224" rx="280" ry="108" transform="rotate(-10 339 224)" fill="none" stroke="#7caefd" strokeDasharray="3 8" opacity=".52" />
          <path d="M-10 318Q70 240 230 233T650 290V326H-10Z" fill="url(#flight-earth)" />
          <path d="M-10 318Q70 240 230 233T650 290" fill="none" stroke="#71c1fb" strokeWidth="2" />
          <path d="M-10 320Q70 243 230 236T650 293M-10 325Q70 248 230 238T650 296" fill="none" stroke="#bde8ff" strokeOpacity=".38" />
          <path d="M75 296Q165 261 250 267T360 253M220 242Q266 256 322 242T429 252M414 278Q487 277 530 291" fill="none" stroke="#e4f3ff" strokeWidth="5" strokeLinecap="round" opacity=".17" />
        </> : <>
          <rect x="0" y="115" width="640" height="205" fill="url(#flight-sky)" opacity={1 - rise} />
          <path d="M0 295 64 270 126 285 198 270 262 280 324 266 409 281 493 274 560 281 640 273V320H0Z" fill="#192d4a" opacity={1 - rise} />
          <path d="M211 286H446M214 294H433M261 282V101H249V282M255 118H292M255 159H286M255 239H284M248 101L263 86M275 282L249 267L263 248L249 210L263 176L249 146" stroke="#6e819b" strokeWidth="2.5" fill="none" opacity={1 - rise} />
          {flight && <g>
            <path d={`M311 ${base - 5} Q315 ${base + 36} 320 ${base + 66} Q326 ${base + 38} 329 ${base - 5}Z`} fill="url(#flight-exhaust)" />
            {Array.from({ length: 20 }, (_, i) => {
              const age = (i / 20 + progress * 2.3) % 1
              return <circle key={i} cx={320 + ((i * 9 % 17) - 8) * (0.5 + age * 5)} cy={base + age * 89} r={1 + age * 5} fill={i % 3 ? '#ffd3a2' : '#ff9655'} opacity={(1 - age) * .68} />
            })}
          </g>}
        </>}
      </svg>
      <canvas ref={canvas} width="1280" height="640" />
    </div>
  )
}
