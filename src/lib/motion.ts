const DEFAULT_FRAME_MS = 1000 / 30;

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function createFrameScheduler(callback: (time: number) => void, frameMs = DEFAULT_FRAME_MS) {
  let frame = 0;
  let lastRun = 0;

  const run = (time: number) => {
    frame = 0;
    if (time - lastRun < frameMs) return;
    lastRun = time;
    callback(time);
  };

  return {
    schedule() {
      if (frame) return;
      frame = window.requestAnimationFrame(run);
    },
    runNow() {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      lastRun = performance.now();
      callback(lastRun);
    },
    cancel() {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

export function createFrameLoop(
  callback: (time: number, delta: number) => void,
  frameMs = DEFAULT_FRAME_MS,
) {
  let frame = 0;
  let running = false;
  let lastRender = 0;

  const tick = (time: number) => {
    if (!running) return;
    frame = window.requestAnimationFrame(tick);
    if (time - lastRender < frameMs) return;

    const delta = lastRender ? Math.min(66, time - lastRender) : frameMs;
    lastRender = time;
    callback(time, delta);
  };

  return {
    start() {
      if (running) return;
      running = true;
      lastRender = 0;
      frame = window.requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}
