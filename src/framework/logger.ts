import type { LoggerBase, Logger } from './type'
import debug from 'debug'

const getLoggerFromBase = (loggerBase: LoggerBase) => {
    return {
        ...loggerBase,
        debug(...rest: any[]) {
            return this._log('debug', ...rest)
        },
        log(...rest: any[]) {
            return this._log('log', ...rest)
        },
        warn(...rest: any[]) {
            return this._log('warn', ...rest)
        },
        error(...rest: any[]) {
            return this._log('error', ...rest)
        },
    } satisfies Logger as Logger
}
export const defaultLogger = getLoggerFromBase({
    _log(level, ...rest: any[]) {
        const types = rest.map(
            (d) =>
                ({
                    object: '%O',
                    string: '%s',
                    number: '%d',
                    bigint: '%d',
                    boolean: '%s',
                    symbol: '%s',
                    undefined: '%s',
                    function: '%s',
                }[typeof d])
        )
        return debug(`server:${level}`)(types.join(' '), ...rest)
        // return console[level](
        //     `[${level[0].toUpperCase()}][${Date.now()}]`,
        //     ...rest
        // )
    },
})
