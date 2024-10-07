import primaryHttpMiddleware from "./primaryHttpMiddleware"
import bodyParser from "koa-bodyparser"
import validatorGuard from "./guard/validator"
import paramGuard from "./guard/param"
import { createModule } from "../../framework/util"

export default createModule((app) => {
  app.koa.use(bodyParser())

  app.use(primaryHttpMiddleware)
  app.use(validatorGuard)
  app.use(paramGuard)
})
