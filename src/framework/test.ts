import { Application } from "./application"

export function startTestApplication() {
  return Application.create().then(async (app) => {
    app._routes()
    return app
  })
}
