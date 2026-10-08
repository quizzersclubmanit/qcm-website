// DEV-only logger. Production builds strip ALL console.* via
// vite.config esbuild.drop — this keeps dev-time debugging ergonomic
// without leaking internals (tokens, user data, auth flow) to visitors.
const noop = () => {}

const log = import.meta.env.DEV ? console.log.bind(console) : noop
const warn = import.meta.env.DEV ? console.warn.bind(console) : noop
const error = import.meta.env.DEV ? console.error.bind(console) : noop
const info = import.meta.env.DEV ? (console.info || console.log).bind(console) : noop

export { log, warn, error, info }
export default { log, warn, error, info }
