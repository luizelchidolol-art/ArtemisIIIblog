type Point = [number, number, number]
type Face = { vertices: Point[]; color: string }
type Ring = [number, number]
type FlightVehicle = 'Blue Moon' | 'Starship HLS'

const tau = Math.PI * 2

function shell(rings: Ring[], colors: string[], sides = 24, offset: Point = [0, 0, 0]): Face[] {
  const vertex = ([x, radius]: Ring, corner: number): Point => {
    const angle = corner * tau / sides
    return [x + offset[0], Math.cos(angle) * radius + offset[1], Math.sin(angle) * radius + offset[2]]
  }
  return rings.slice(0, -1).flatMap((ring, i) => Array.from({ length: sides }, (_, j) => ({
    vertices: [vertex(ring, j), vertex(ring, j + 1), vertex(rings[i + 1], j + 1), vertex(rings[i + 1], j)],
    color: colors[i % colors.length],
  })))
}

function plate(color: string, ...vertices: Point[]): Face {
  return { color, vertices }
}

const slsCore = [
  ...shell([[-71, 0], [-71, 12], [-61, 14], [40, 14], [49, 9], [52, 9], [55, 0]], ['#232938', '#c86c3e', '#de8c55', '#df985c', '#cbd7e5', '#e7ebed']),
  ...shell([[43, 0], [43, 10], [56, 10], [66, 6.1], [72, 2.6], [85, 2.6], [91, 0]], ['#bbc9d7', '#e8f0fa', '#d7e3f4', '#e4eafa', '#cbd6e4', '#f9eddd']),
  ...[-5, 5].flatMap((y) => [-5, 5].flatMap((z) => shell([[-79, 0], [-79, 3.3], [-69, 2.3]], ['#242c3d', '#68788e'], 10, [0, y, z]))),
]
const booster = shell([[-76, 0], [-76, 5], [-70, 7], [-63, 7], [-61, 7.1], [-18, 7.1], [-16, 7.1], [21, 7.1], [34, 4], [40, 0]],
  ['#394251', '#6b7d92', '#dae5f4', '#8794a7', '#eff5fe', '#7585a1', '#e4f0fe', '#dbe7f5', '#f0f6ff'])

const capsule = [
  ...shell([[-25, 0], [-25, 8], [-20, 14], [14, 14], [15, 0]], ['#4e6074', '#b9c6d6', '#d6e0ed', '#a9b9cc']),
  ...shell([[12, 14], [16, 16], [18, 15], [32, 7], [36, 7], [38, 5], [38, 0]], ['#8b4a2c', '#bf6844', '#f3eee2', '#e6e8e5', '#b7c7d5', '#424f61']),
  ...shell([[-36, 0], [-36, 6.8], [-33, 7], [-24, 3.6]], ['#273149', '#8f9aac', '#4a5b74'], 16),
  plate('#274263', [21, 13.2, -3.6], [27, 10.4, -3], [27, 10.4, 3], [21, 13.2, 3.6]),
]

for (let branch = 0; branch < 4; branch++) {
  const angle = Math.PI / 4 + branch * tau / 4
  const edge = (x: number, r: number): Point => [x, Math.cos(angle) * r, Math.sin(angle) * r]
  capsule.push(plate('#a3b9cf', edge(-14, 13), edge(-10, 13), edge(-10, 23), edge(-14, 23)))
  for (let col = 0; col < 4; col++) {
    const r = 23 + col * 7
    capsule.push(plate('#395fb4', edge(-22, r), edge(-2, r), edge(-2, r + 6.8), edge(-22, r + 6.8)))
  }
}

const blueMoon = [
  ...shell([[-45, 0], [-45, 10], [-39, 14], [-22, 14], [-20, 12], [-20, 0]], ['#525b67', '#b8cbdc', '#eef4f8', '#9fb3c7', '#adb7c2']),
  ...shell([[-19, 0], [-19, 27], [-13, 29], [19, 29], [22, 26], [24, 26], [24, 0]], ['#5f6576', '#b08543', '#ddb961', '#897042', '#c99f56', '#b68a46']),
  ...shell([[24, 0], [24, 15], [27, 15], [43, 17], [48, 9], [48, 0]], ['#4d566c', '#4b5f7c', '#ecf1f3', '#b9c9d9', '#3f485c']),
  ...shell([[48, 0], [48, 11], [51, 11], [54, 15], [59, 14], [60, 9], [60, 0]], ['#343941', '#9faabb', '#d9dde2', '#9ca8b9', '#a5afbe', '#3b485f'], 20),
  ...shell([[14, 0], [14, 4], [20, 4], [22, 5.8], [24, 5.8], [24, 0]], ['#8498ad', '#cfd9e6', '#9aaabd', '#dbe6f1', '#465468'], 18)
    .map(({ color, vertices }) => ({ color, vertices: vertices.map(([axis, y, radial]): Point => [35 - radial, y, axis]) })),
]

for (let branch = 0; branch < 4; branch++) {
  const angle = branch * tau / 4 + Math.PI / 4
  const leg = (x: number, r: number, width: number): Point => [x, Math.cos(angle) * r - Math.sin(angle) * width, Math.sin(angle) * r + Math.cos(angle) * width]
  blueMoon.push(
    plate('#dabb77', leg(16, 27, -2), leg(16, 27, 2), leg(50, 44, 2), leg(50, 44, -2)),
    plate('#aba48d', leg(5, 25, -1), leg(5, 25, 1), leg(35, 40, 1), leg(35, 40, -1)),
    plate('#9ca7b2', leg(50, 38, -5), leg(50, 51, -5), leg(50, 51, 5), leg(50, 38, 5)),
    plate('#5c564e', leg(-10, 29.2, -2), leg(17, 29.2, -2), leg(17, 29.2, 2), leg(-10, 29.2, 2)),
  )
}

const starship = [
  ...shell([[-62, 0], [-62, 14], [-59, 17], [-43, 17], [-41, 17], [-15, 17], [-13, 17], [15, 17], [17, 17], [34, 16], [44, 12], [54, 8], [60, 6], [60, 0]],
    ['#2d3545', '#738397', '#6d7d8e', '#a6b6c4', '#bcc9d3', '#718296', '#a9bac8', '#67798d', '#becdd9', '#a8b7c3', '#d0dce1', '#b4c4d3', '#526275']),
  ...[-1, 1].flatMap((side) => [
    plate('#354554', [-57, 0, side * 15], [-55, 0, side * 28], [-43, 0, side * 28], [-16, 0, side * 15]),
    plate('#8296a5', [14, 0, side * 16], [22, 0, side * 27], [35, 0, side * 25], [39, 0, side * 14]),
  ]),
  plate('#172f4b', [27, 15.6, -4], [35, 14.6, -2.8], [35, 14.6, 2.8], [27, 15.6, 4]),
]

const translate = (mesh: Face[], anchor: Point, direction = 1) => mesh.map(({ vertices, color }) => ({
  color,
  vertices: vertices.map(([x, y, z]): Point => [anchor[0] + direction * x, anchor[1] + y, anchor[2] + direction * z]),
}))

export function orbitGeometry(target: FlightVehicle, gap: number, alignment: number) {
  // Both ports face Orion at x = -37. Blue Moon presents its side-mounted
  // cabin port while Starship presents its forward port.
  const lander = target === 'Blue Moon'
    ? blueMoon.map(({ vertices, color }) => ({
      color,
      vertices: vertices.map(([x, y, z]): Point => [-13 - z, y, x - 35]),
    }))
    : translate(starship, [23, 0, 0], -1)
  return [
    ...translate(capsule, [-75 - gap, alignment, 0]),
    ...lander,
  ]
}

export function targetGeometry(target: FlightVehicle) {
  return target === 'Blue Moon' ? blueMoon : starship
}

export function rocketGeometry(separation: number) {
  const boosters = separation >= 0.92 ? [] : [-1, 1].flatMap((side) =>
    translate(booster, [-12 - separation * 150, side * (20 + separation * 109), 0]))
  return [...slsCore, ...boosters].map(({ color, vertices }) => ({
    color, vertices: vertices.map(([x, y, z]): Point => [-y, x, z]),
  }))
}

export function projectFlight(mesh: Face[], options: { azimuth: number; elevation: number; scale: number; offsetX?: number; offsetY?: number; width: number; height: number }) {
  const { azimuth, elevation, scale, width, height, offsetX = 0, offsetY = 0 } = options
  const [ca, sa, cb, sb] = [Math.cos(azimuth), Math.sin(azimuth), Math.cos(elevation), Math.sin(elevation)]
  return mesh.map(({ vertices, color }) => {
    const points = vertices.map(([x, y, z]) => {
      const horizontal = x * ca + z * sa
      const depth = z * ca - x * sa
      const vertical = y * cb - depth * sb
      const distance = y * sb + depth * cb
      const perspective = 510 / Math.max(120, 510 - distance)
      return { x: width / 2 + offsetX + horizontal * scale * perspective, y: height / 2 + offsetY - vertical * scale * perspective, z: distance }
    })
    const [a, b, c] = points
    const normal = ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / (scale * scale)
    return {
      points,
      depth: points.reduce((sum, point) => sum + point.z, 0) / points.length,
      shade: normal >= 0 ? 'rgba(230,244,255,0.08)' : 'rgba(5,14,31,0.18)',
      color,
    }
  }).sort((a, b) => a.depth - b.depth)
}
