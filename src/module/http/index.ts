import type { Module } from "../../framework/type"
import primaryHttpMiddleware from "./primaryHttpMiddleware"
import bodyParser from "koa-bodyparser"
import validatorGuard from "./validatorGuard"
import { createModule } from "../../framework/util"

export default createModule((app) => {
  app.koa.use(bodyParser())

  app.use(primaryHttpMiddleware)
  app.use(validatorGuard)
})
