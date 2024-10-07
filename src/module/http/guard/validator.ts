import { ValidateError } from "../../../error"
import type { Context, Module } from "../../../framework/type"
import type { Next } from "koa"
import { Validator, type RuleArg } from "@anfo/validator"
import { createGuard, createModule } from "../../../framework/util"
import { pick } from "lodash"

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
      function getKeys(value: any) {
        return Object.keys(value).map((k) =>
          k.endsWith("$") ? k.slice(0, -1) : k
        )
      }
      if (rule.query) {
        const err = await validator.v(ctx.query, rule.query)
        if (err) {
          failed(err)
        }
        if (onlyKeysInRule) {
          ctx.query = pick(ctx.query, getKeys(rule.query))
        }
      }
      if (rule.body) {
        const err = await validator.v(ctx.request.body, rule.body)
        if (err) {
          failed(err)
        }
        if (onlyKeysInRule) {
          ctx.request.body = pick(ctx.request.body, getKeys(rule.body))
        }
      }
      if (rule.params) {
        const err = await validator.v(ctx.params, rule.params)
        if (err) {
          failed(err)
        }
        if (onlyKeysInRule) {
          ctx.params = pick(ctx.params, getKeys(rule.params))
        }
      }
      return await next()
    }
  }
)

export default createModule((app) => {
  app.guard.v = v
})
