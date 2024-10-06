import type { Module } from "../framework/type"
import { createModule } from "../framework/util"
import http from "./http"

export default createModule((app) => {
  // submodule
  app.use(http)
})
