type View = { longitude: number; latitude: number; zoom: number };
type Renderer = {
  draw: (view: View, interactive: boolean, spinning: boolean) => void;
  dispose: () => void;
};

const vertexSource = `
  attribute vec2 position;
  varying vec2 point;
  void main() {
    point = position;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision highp float;
  varying vec2 point;
  uniform sampler2D mosaic;
  uniform vec4 rotation;
  uniform float radius;
  uniform float minimumLight;
  uniform float edge;
  const float pi = 3.14159265359;

  void main() {
    vec2 plane = point / radius;
    float distance2 = dot(plane, plane);
    if (distance2 > 1.0) discard;
    vec3 normal = vec3(plane, sqrt(1.0 - distance2));
    float y = normal.y * rotation.w + normal.z * rotation.z;
    float pitchedZ = normal.z * rotation.w - normal.y * rotation.z;
    float x = normal.x * rotation.y + pitchedZ * rotation.x;
    float z = pitchedZ * rotation.y - normal.x * rotation.x;
    vec2 uv = vec2(
      fract(0.5 + atan(x, z) / (2.0 * pi)),
      0.5 - asin(clamp(y, -1.0, 1.0)) / pi
    );
    vec3 surface = texture2D(mosaic, uv).rgb;
    float daylight = max(0.0, dot(normal, vec3(-0.642, 0.470, 0.606)));
    float illumination = minimumLight + (1.47 - minimumLight) * daylight;
    vec3 color = surface * illumination * vec3(1.05, 1.035, 1.055);
    gl_FragColor = vec4(color, 1.0 - smoothstep(1.0 - edge, 1.0, distance2));
  }
`;

function angle(degrees: number) {
  return degrees * Math.PI / 180;
}

function createGpuRenderer(
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
): Renderer | null {
  const program = gl.createProgram();
  const mesh = gl.createBuffer();
  const texture = gl.createTexture();
  if (!program || !mesh || !texture) return null;
  const shaders: WebGLShader[] = [];
  const dispose = () => {
    for (const shader of shaders) gl.deleteShader(shader);
    gl.deleteProgram(program);
    gl.deleteBuffer(mesh);
    gl.deleteTexture(texture);
  };

  const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  const fragment = precision?.precision ? fragmentSource : fragmentSource.replace("highp", "mediump");
  for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragment]] as const) {
    const shader = gl.createShader(type);
    if (!shader) {
      dispose();
      return null;
    }
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose();
    return null;
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const rotation = gl.getUniformLocation(program, "rotation");
  const radius = gl.getUniformLocation(program, "radius");
  const edge = gl.getUniformLocation(program, "edge");
  const minimumLight = gl.getUniformLocation(program, "minimumLight");

  return {
    draw(view, interactive) {
      const size = Math.min(1040, Math.max(80, Math.round(canvas.clientWidth * devicePixelRatio)));
      if (canvas.width !== size) {
        canvas.width = size;
        canvas.height = size;
      }
      gl.viewport(0, 0, size, size);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const yaw = angle(view.longitude);
      const pitch = angle(view.latitude);
      const scale = (interactive ? 0.86 : 0.985) * view.zoom;
      gl.uniform4f(rotation, Math.sin(yaw), Math.cos(yaw), Math.sin(pitch), Math.cos(pitch));
      gl.uniform1f(radius, scale);
      gl.uniform1f(minimumLight, interactive ? 0.43 : 0.24);
      gl.uniform1f(edge, 3.5 / (size * scale));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose,
  };
}

function createCanvasRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement): Renderer | null {
  const surface = document.createElement("canvas");
  surface.width = image.naturalWidth;
  surface.height = image.naturalHeight;
  const texture = surface.getContext("2d", { willReadFrequently: true });
  const context = canvas.getContext("2d");
  if (!texture || !context) return null;
  texture.drawImage(image, 0, 0);
  const { width, height } = surface;
  const pixels = texture.getImageData(0, 0, width, height).data;
  const size = 384;
  canvas.width = size;
  canvas.height = size;
  const frame = context.createImageData(size, size);
  let lastPaint = -Infinity;
  let previousZoom = 0;

  return {
    draw(view, interactive, spinning) {
      const now = performance.now();
      if (spinning && now - lastPaint < 60 && view.zoom === previousZoom) return;
      lastPaint = now;
      previousZoom = view.zoom;
      const scale = (interactive ? 0.86 : 0.985) * view.zoom;
      const bias = interactive ? 0.43 : 0.24;
      const yaw = angle(view.longitude);
      const pitch = angle(view.latitude);
      const yawSin = Math.sin(yaw);
      const yawCos = Math.cos(yaw);
      const pitchSin = Math.sin(pitch);
      const pitchCos = Math.cos(pitch);

      for (let row = 0; row < size; row++) {
        const ny = (1 - (row + 0.5) * 2 / size) / scale;
        for (let column = 0; column < size; column++) {
          const nx = ((column + 0.5) * 2 / size - 1) / scale;
          const distance2 = nx * nx + ny * ny;
          const pixel = 4 * (row * size + column);
          if (distance2 > 1) {
            frame.data[pixel + 3] = 0;
            continue;
          }
          const nz = Math.sqrt(1 - distance2);
          const y = ny * pitchCos + nz * pitchSin;
          const pitchedZ = nz * pitchCos - ny * pitchSin;
          const x = nx * yawCos + pitchedZ * yawSin;
          const z = pitchedZ * yawCos - nx * yawSin;
          const u = Math.floor((0.5 + Math.atan2(x, z) / (2 * Math.PI)) * width) % width;
          const v = Math.min(height - 1, Math.floor((0.5 - Math.asin(Math.max(-1, Math.min(1, y))) / Math.PI) * height));
          const source = 4 * (v * width + u);
          const light = bias + (1.47 - bias) * Math.max(0, -0.642 * nx + 0.47 * ny + 0.606 * nz);
          frame.data[pixel] = pixels[source] * light * 1.05;
          frame.data[pixel + 1] = pixels[source + 1] * light * 1.035;
          frame.data[pixel + 2] = pixels[source + 2] * light * 1.055;
          frame.data[pixel + 3] = Math.min(255, (1 - distance2) * 255 * size * scale / 3.5);
        }
      }
      context.putImageData(frame, 0, 0);
    },
    dispose() {},
  };
}

export function createLunarRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement): Renderer | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
  return gl ? createGpuRenderer(gl, canvas, image) : createCanvasRenderer(canvas, image);
}
