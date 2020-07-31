// @flow

// Values used to control how the fluid auto scroll feels
const config = {
  // percentage distance from edge of container:
  startFromPercentage: 0.25,
  maxScrollAtPercentage: 0.05,
  // pixels per frame
  maxPixelScroll: 28,

  startLeftFromPixels: 0, // отступ слева, когда начать скролл (например, ширина navpanel)
  startRightFromPixels: 0,  // отступ справа, когда начать скролл
  overlapPixels: 0, // сдвиг отступа

  // A function used to ease a percentage value
  // A simple linear function would be: (percentage) => percentage;
  // percentage is between 0 and 1
  // result must be between 0 and 1
  ease: (percentage: number): number => Math.pow(percentage, 2),

  durationDampening: {
    // ms: how long to dampen the speed of an auto scroll from the start of a drag
    stopDampeningAt: 1200,
    // ms: when to start accelerating the reduction of duration dampening
    accelerateAt: 360,
  },
};

export default config;
