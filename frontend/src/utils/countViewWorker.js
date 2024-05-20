let viewTime = 0;
let interval = null;
let videoDuration;
let viewCounted = false;

const VIEW_TIME = 'view time';
const VIEW_COUNTED = 'view counted';
const START = 'start';
const PAUSE = 'pause';
const END = 'end';

export const viewWorkerMsg = {
  VIEW_TIME,
  VIEW_COUNTED,
  START,
  PAUSE,
  END,
};

const countViewFunction = () => {
  viewTime++;

  if (viewTime % 3 === 0) {
    self.postMessage({
      message: VIEW_TIME,
      viewTime,
    });
  }

  // For video longer than 30s, count view if user has viewed 30s
  if (viewTime === 30 && videoDuration > 30) {
    self.postMessage({
      message: VIEW_COUNTED,
      viewTime,
    });
    viewCounted = true;

    // For video shorter than 30s, count view if user has viewed the same duration as video duration - 1 as buffer
  } else if (viewTime === parseInt(videoDuration - 1) && videoDuration <= 30) {
    self.postMessage({
      message: VIEW_COUNTED,
      viewTime: viewTime + 1,
    });
    viewCounted = true;
  }
};

self.onmessage = function (e) {
  // Set total video duration
  if (e.data.duration) {
    videoDuration = e.data.duration;
  }

  // Start message: start counting view time
  if (e.data.message === START) {
    if (interval) return;

    interval = setInterval(countViewFunction, 1000);

    // Pause message: clear interval to pause view time count
  } else if (e.data.message === PAUSE) {
    clearInterval(interval);
    interval = null;

    // End message: if view already counted: reset counter. if view has not been counted, continue to count
  } else if (e.data.message === END) {
    if (viewCounted) {
      clearInterval(interval);
      interval = null;
      viewTime = 0;
      viewCounted = false;
    }
  }
};
