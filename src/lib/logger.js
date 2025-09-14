const levels = { debug: 0, info: 1, error: 2, none: 3 };

const isProd = import.meta.env.PROD;
const envLevel = (import.meta.env.VITE_LOG_LEVEL || '').toLowerCase();
let currentLevel = levels[envLevel];
if (currentLevel === undefined) {
  currentLevel = isProd ? levels.error : levels.debug;
}

function shouldLog(level) {
  return levels[level] >= currentLevel;
}

function log(level, args) {
  if (!shouldLog(level)) return;
  if (isProd && level === 'debug') return;
  const fn = console[level] || console.log;
  fn(...args);
}

const logger = {
  debug: (...args) => log('debug', args),
  info: (...args) => log('info', args),
  error: (...args) => log('error', args)
};

export default logger;
