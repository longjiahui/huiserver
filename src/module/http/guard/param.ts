import { clamp } from 'lodash'
import { createGuard, createModule } from '../../../framework/util'
import { ValidateError } from '../../../error'

type ArgType = 'body' | 'params' | 'query'

export const paramGuard = createGuard(
    (
            name: string,
            guard: (val: any, g: object) => any,
            type: ArgType = 'body'
        ) =>
        async (ctx, next) => {
            const target =
                (
                    {
                        body: ctx.request.body as any,
                        params: ctx.params,
                        query: ctx.query,
                    } satisfies Record<ArgType, object | undefined>
                )[type] || {}
            let value = target?.[name]
            value = guard(value, target)
            Object.assign(target || {}, { [name]: value })
            return next()
        }
)

export const jsonGuard = createGuard(
    (
        name: string,
        options: {
            type?: ArgType
            optional?: boolean
        } = {}
    ) => {
        let { type, optional } = options || {}
        type = type ?? ('body' as ArgType)
        optional = optional ?? false
        return (ctx, next) => {
            return paramGuard(
                name,
                (val) => {
                    try {
                        if (!optional || val != undefined) {
                            return JSON.parse(val)
                        } else {
                            // 可以为null \ undefined
                            return val
                        }
                    } catch (error) {
                        throw new ValidateError(`参数[${name}]不是json格式`)
                    }
                },
                type
            )(ctx, next)
        }
    }
)

export const numberGuard = createGuard(
    (name: string, type: ArgType = 'body') =>
        (ctx, next) => {
            return paramGuard(
                name,
                (val) => {
                    val = +val
                    if (isNaN(val)) {
                        throw new ValidateError(`参数[${name}]不是数字`)
                    } else {
                        return val
                    }
                },
                type
            )(ctx, next)
        }
)

export default createModule((app) => {
    app.guard.param = paramGuard
    app.guard.number = numberGuard
    app.guard.json = jsonGuard
})
