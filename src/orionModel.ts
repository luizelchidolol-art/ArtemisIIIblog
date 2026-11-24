export type Vector = [number, number, number];
type Face = { points: Vector[]; color: string; part: string };
const faces: Face[] = [];
const tau = 2 * Math.PI;

function body(
  part: string,
  rings: [number, number][],
  colors: string[],
  sides = 20,
) {
  const vertex = (ring: number, corner: number): Vector => {
    const [x, radius] = rings[ring];
    return [
      x,
      radius * Math.cos((corner * tau) / sides),
      radius * Math.sin((corner * tau) / sides),
    ];
  };
  for (let ring = 0; ring < rings.length - 1; ring++) {
    for (let corner = 0; corner < sides; corner++) {
      faces.push({
        points: [
          vertex(ring, corner),
          vertex(ring, corner + 1),
          vertex(ring + 1, corner + 1),
          vertex(ring + 1, corner),
        ],
        color: colors[ring % colors.length],
        part,
      });
    }
  }
}

body(
  "crew",
  [
    [-31, 28],
    [1, 12],
    [9, 11],
    [10, 0],
  ],
  ["#e1e8fa", "#c6d5eb", "#9baccc"],
);
body(
  "heat",
  [
    [-37, 26],
    [-33, 30],
    [-30, 28],
  ],
  ["#b37752", "#7b4b44"],
);
body(
  "service",
  [
    [-88, 0],
    [-88, 13],
    [-82, 24],
    [-38, 24],
    [-36, 0],
  ],
  ["#515e76", "#92a4bf", "#c0cce2", "#98acc9"],
);
body(
  "engine",
  [
    [-113, 0],
    [-113, 14],
    [-107, 14],
    [-89, 7],
    [-86, 7],
  ],
  ["#353956", "#8995b0", "#566584", "#98acc9"],
);
body(
  "abort",
  [
    [11, 0],
    [11, 8],
    [22, 7],
    [31, 3.6],
    [78, 3.6],
    [87, 0],
  ],
  ["#92aad5", "#c2cee4", "#a1acce", "#ecedfa", "#ff8e69"],
);

for (let arm = 0; arm < 4; arm++) {
  const angle = (arm * tau) / 4 + Math.PI / 4;
  const point = (x: number, r: number): Vector => [
    x,
    Math.cos(angle) * r,
    Math.sin(angle) * r,
  ];
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 2; column++) {
      const x = -77 + column * 12;
      const r = 30 + row * 15;
      faces.push({
        points: [
          point(x, r),
          point(x + 12, r),
          point(x + 12, r + 15),
          point(x, r + 15),
        ],
        color: row % 2 ? "#3656b3" : "#283d89",
        part: "solar",
      });
    }
  }
  faces.push({
    points: [point(-76, 23), point(-56, 23), point(-56, 30), point(-76, 30)],
    color: "#98acc8",
    part: "solar",
  });
}
faces.push({
  points: [
    [-61, 20, -9],
    [-59, 40, -9],
    [-49, 43, 0],
    [-50, 37, 9],
    [-58, 20, 9],
  ],
  color: "#dce3f0",
  part: "comms",
});
faces.push({
  points: [
    [-22, 25, -6],
    [-16, 22, -5],
    [-16, 22, 5],
    [-22, 25, 6],
  ],
  color: "#314665",
  part: "crew",
});

export function projectOrion(
  yaw: number,
  pitch: number,
  zoom: number,
  showTower: boolean,
) {
  const [ca, sa, cb, sb] = [
    Math.cos(yaw),
    Math.sin(yaw),
    Math.cos(pitch),
    Math.sin(pitch),
  ];
  return faces
    .filter(({ part }) => showTower || part !== "abort")
    .map((face) => {
      const points = face.points.map(([x, y, z]) => {
        const horizontal = x * ca + z * sa;
        const depth = z * ca - x * sa;
        const vertical = y * cb - depth * sb;
        const distance = y * sb + depth * cb;
        return {
          x: 260 + horizontal * zoom,
          y: 139 - vertical * zoom,
          z: distance,
        };
      });
      const [a, b, c] = points;
      const normal =
        ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / (zoom * zoom);
      return {
        ...face,
        vertices: points
          .map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`)
          .join(" "),
        depth: points.reduce((sum, p) => sum + p.z, 0) / points.length,
        brightness: 0.78 + Math.min(0.35, Math.abs(normal) / 980),
      };
    })
    .sort((a, b) => a.depth - b.depth);
}
