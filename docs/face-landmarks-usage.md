Face Landmarks Detection – Practical Guidelines

- Load order:
  - `@tensorflow/tfjs-core` → `@tensorflow/tfjs-converter` → a backend (`@tensorflow/tfjs-backend-cpu` or wasm) → `@tensorflow-models/face-landmarks-detection` (or the local UMD bundle).
  - After the libs, load your analysis scripts that call the model and draw overlays.

- Model loading:
  - Use `faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh, { maxFaces: 1 })`.
  - Run once and reuse the model to avoid repeated warmups.

- Inference:
  - Call `model.estimateFaces({ input: HTMLImageElement | HTMLCanvasElement })`.
  - Expect an array of predictions, each with:
    - `annotations`: named keypoints arrays; `scaledMesh`: full mesh; `box`: bounding box.
  - Use the first face when `maxFaces: 1`.

- Annotations used by our analysis (keys on `predictions[0].annotations`):
  - Eyes and iris: `rightEyeIris`, `leftEyeIris`, `rightEyeLower1`, `leftEyeLower1`, `rightEyeUpper0`, `leftEyeUpper0`, `rightEyeLower0`, `leftEyeLower0`.
  - Brows: `rightEyebrowUpper`, `leftEyebrowUpper`.
  - Nose: `noseBottom`, `noseRightCorner`, `noseLeftCorner`.
  - Lips: `lipsUpperOuter`, `lipsUpperInner`, `lipsLowerOuter`.
  - Silhouette: `silhouette` (e.g., indices around the jawline and cheekbones, used for zygo, gonial, chin points).

- Coordinate system:
  - Points are `[x, y, z?]` in input image pixel coordinates when using DOM images/canvas.
  - Distances for ratios use Euclidean distance in pixels; since both numerator and denominator are in pixels, the ratio is scale-invariant.

- Measurement stability tips:
  - Use neutral, forward-facing images with minimal rotation and good lighting.
  - Increase `ctx.lineWidth` and dynamic `arcRadius` based on image area to keep overlays visible on any resolution.

- Backends:
  - CPU backend is the most portable; wasm backend can speed up inference: load `@tensorflow/tfjs-backend-wasm` and call `await tf.setBackend('wasm')` before loading the model.

- Error handling:
  - If `predictions.length === 0`, show a friendly message and do not attempt to render overlays.
  - Wrap image fetch/load and model inference in try/catch; keep UI responsive with a spinner and status messages.

- Drawing overlays:
  - Always redraw the base image before drawing new overlays to avoid ghosting.
  - Use feature toggles to selectively render lines/points per metric.
  - Keep a consistent color per metric to aid interpretation.

- Database thresholds:
  - Each metric compares computed value to ideal ranges with a small deviation step to classify: perfect, deviation-0..4.
  - Store thresholds in `/parallellabs/database.json` and provide a JS fallback for robustness.

- Common pitfalls:
  - Loading scripts out of order (tf core/converter/backend must precede the model bundle).
  - Mixing module types (ESM vs UMD). Use UMD builds when injecting scripts dynamically.
  - Mismatched canvas size vs image size; always set canvas width/height to image dimensions before drawing.

