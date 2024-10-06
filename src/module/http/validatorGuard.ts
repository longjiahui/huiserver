import { ValidateError } from "../../error"
import type { Context, Module } from "../../framework/type"
import type { Next } from "koa"
import { Validator, type RuleArg } from "@anfo/validator"
import { createGuard, createModule } from "../../framework/util"

const validator = new Validator()
export const v = createGuard(
  (rule: { body?: RuleArg; params?: RuleArg; query?: RuleArg } = {}) => {
    return async (ctx: Context, next: Next) => {
      const failed = (err: string) => {
        throw new ValidateError(`params validate failed: ${err}`)
      }
      if (rule.query) {
        const err = await validator.v(ctx.query, rule.query)
        if (err) {
          failed(err)
        }
      }
      if (rule.body) {
        const err = await validator.v(ctx.request.body, rule.body)
        if (err) {
          failed(err)
        }
      }
      if (rule.params) {
        const err = await validator.v(ctx.params, rule.params)
        if (err) {
          failed(err)
        }
      }
      return await next()
    }
  }
)

export default createModule((app) => {
  app.guard.v = v
})
