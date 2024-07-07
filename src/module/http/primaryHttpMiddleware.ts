import { AuthError, ServiceError, ValidateError } from '../../error'
import type { Module } from '../../framework/type'
import {
    defaultError,
    notLoginError,
    serviceFailed,
    success,
    validateError,
} from '../../util'

export default ((app) => {
    app.koa.use(async (ctx, next) => {
        const defalutLog = `[${ctx.path}]${
            (ctx.state.user?.email && `[${ctx.state.user.email}]`) ||
            `[${ctx.ip}]`
        }`
        const log = (...rest: any[]) => app.logger.log(defalutLog, ...rest)
        const debug = (...rest: any[]) => app.logger.debug(defalutLog, ...rest)
        const error = (...rest: any[]) => app.logger.error(defalutLog, ...rest)
        try {
            const ret = await next()
            setTimeout(() => {
                // 不阻碍同步流程
                debug((ret != null && ret) || '')
            })
            ctx.body = success(ret)
        } catch (err) {
            if (err instanceof AuthError) {
                log(err.message)
                ctx.body = notLoginError(err.message)
            } else if (err instanceof ValidateError) {
                log(err.message)
                ctx.body = validateError(err.message)
            } else if (err instanceof ServiceError) {
                log(err.message)
                ctx.body = serviceFailed(err.message)
            } else {
                error(err)
                ctx.body = defaultError
            }
        } finally {
            log(ctx.status)
        }
    })
}) as Module
