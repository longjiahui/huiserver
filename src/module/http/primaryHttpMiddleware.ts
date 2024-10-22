import { AuthError, ServiceError, ValidateError } from '../../error'
import { createModule } from '../../framework/util'
import {
    type Response,
    notLoginError,
    serviceFailed,
    success,
    validateError,
} from '../../util'

export default createModule((app) => {
    app.koa.use(async (ctx, next) => {
        const defalutLog = `[${ctx.path}]${
            (ctx.state.user?.email && `[${ctx.state.user.email}]`) ||
            `[${ctx.ip}]`
        }`
        const log = (...rest: any[]) => app.logger.log(defalutLog, ...rest)
        const debug = (...rest: any[]) => app.logger.debug(defalutLog, ...rest)
        const error = (...rest: any[]) => app.logger.error(defalutLog, ...rest)
        let finalReturn: Response | undefined = undefined
        try {
            const ret = await next()
            setTimeout(() => {
                // 不阻碍同步流程
                debug((ret != null && ret) || '')
            })
            if (ctx.body !== undefined) {
                finalReturn = ctx.body
            } else {
                finalReturn = success(ret)
            }
        } catch (err) {
            if (err instanceof AuthError) {
                debug(err.message)
                finalReturn = notLoginError(err.message)
            } else if (err instanceof ValidateError) {
                debug(err.message)
                finalReturn = validateError(err.message)
            } else if (err instanceof ServiceError) {
                debug(err.message)
                finalReturn = serviceFailed(err.message)
            } else {
                error(err)
            }
        } finally {
            ctx.body = finalReturn
            const logData = [
                ctx.status,
                ...(finalReturn?.code! < 0
                    ? [finalReturn?.code, finalReturn!.reason]
                    : []),
            ]
            log(...logData)
        }
    })
})
