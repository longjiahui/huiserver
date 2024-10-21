import { ValidateError } from '../../../error'
import type { Context, Module } from '../../../framework/type'
import type { Next } from 'koa'
import { Validator, type RuleArg } from '@anfo/validator'
import { createGuard, createModule } from '../../../framework/util'

const validator = new Validator()
export const v = createGuard(
    (
        rule: { body?: RuleArg; params?: RuleArg; query?: RuleArg } = {},
        options: {
            // true 只有rule中列出的参数可以通过
            onlyKeysInRule?: boolean
        } = {}
    ) => {
        const { onlyKeysInRule } = Object.assign(
            {
                onlyKeysInRule: true,
            } satisfies typeof options,
            options
        )
        return async (ctx: Context, next: Next) => {
            const failed = (err: string) => {
                throw new ValidateError(`params validate failed: ${err}`)
            }
            // function getKeys(value: any) {
            //     return Object.keys(value).map((k) =>
            //         k.endsWith('$') ? k.slice(0, -1) : k
            //     )
            // }
            function _pick<
                T extends Record<any, any>,
                From extends Record<any, any>
            >(d: T, from: From) {
                return Object.keys(from).reduce((t, k) => {
                    k = k.endsWith('$') ? k.slice(0, -1) : k
                    t[k as keyof From] =
                        from[k] &&
                        typeof from[k] === 'object' &&
                        !(from[k] instanceof RegExp)
                            ? _pick(d[k], from[k])
                            : d[k]
                    return t
                    // 这里的类型是不准确的，但不重要。
                }, {} as { [k in keyof From]: T[k] })
            }
            if (rule.query) {
                const err = await validator.v(ctx.query, rule.query)
                if (err) {
                    failed(err)
                }
                if (
                    onlyKeysInRule &&
                    typeof rule.query === 'object' &&
                    !(rule.query instanceof RegExp) &&
                    !(rule.query instanceof Array)
                ) {
                    ctx.query = _pick(ctx.query, rule.query)
                }
            }
            if (rule.body) {
                const err = await validator.v(ctx.request.body, rule.body)
                if (err) {
                    failed(err)
                }
                if (
                    onlyKeysInRule &&
                    typeof rule.body === 'object' &&
                    !(rule.body instanceof RegExp) &&
                    !(rule.body instanceof Array)
                ) {
                    ctx.request.body = _pick(ctx.request.body || {}, rule.body)
                }
            }
            if (rule.params) {
                const err = await validator.v(ctx.params, rule.params)
                if (err) {
                    failed(err)
                }
                if (
                    onlyKeysInRule &&
                    typeof rule.params === 'object' &&
                    !(rule.params instanceof RegExp) &&
                    !(rule.params instanceof Array)
                ) {
                    ctx.params = _pick(ctx.params, rule.params)
                }
            }
            return await next()
        }
    }
)

export default createModule((app) => {
    app.guard.v = v
})
