import { type Server as HttpServer, createServer } from "node:http"
import Koa, { type DefaultContext, type DefaultState } from "koa"
import { Server as IOServer, Socket } from "socket.io"
import KoaRouter from "koa-router"
import type { v } from "../module/http/guard/validator"
import type { Logger, Module } from "./type"
import { defaultLogger } from "./logger"
import mods from "../module"

import { FatalError } from "../error"
import { Layer, Middleware } from "./layer"
import { type numberGuard, type paramGuard } from "../module/http/guard/param"

export class IOMiddleware extends Middleware<
  [IOServer, Socket, ...any[]],
  any
> {}

export interface ApplicationGuard {
  v: typeof v
  param: typeof paramGuard
  number: typeof numberGuard
}

export class Application {
  public httpServer: HttpServer
  public koa: Koa
  public httpRouter: KoaRouter<DefaultState, DefaultContext>
  public logger: Logger

  public guard: ApplicationGuard = {} as any

  // io
  public ioServer: IOServer
  public ioMiddlewares: IOMiddleware[] = []

  private modAmount = 0

  static async create(...rest: ConstructorParameters<typeof Application>) {
    const ret = new Application(...rest)
    await ret.use(mods)
    return ret
  }

  constructor(
    options: {
      ioMiddlewares?: IOMiddleware[]
      logger?: Logger
    } = {}
  ) {
    this.koa = new Koa()
    this.httpRouter = new KoaRouter<DefaultState, DefaultContext>()
    this.httpServer = createServer(this.koa.callback())
    this.httpServer.on("listening", () => {
      let address = this.httpServer.address()
      if (address && typeof address === "object") {
        address = `http://${address.address}:${address.port}`
      }
      this.logger.log(`loaded ${this.modAmount} modules`)
      this.logger.log(`listened: ${address}`)
    })
    this.ioServer = new IOServer(this.httpServer, {
      cors: {
        origin: "*",
      },
    })
    this.ioMiddlewares = options.ioMiddlewares ?? []
    this.logger = options.logger ?? defaultLogger
  }

  async use(mod: Module) {
    await mod.module(this)
    if (mod.name) {
      this.logger.log("module loaded: ", mod.name)
    }
    this.modAmount += 1
    return this
  }

  /**
   * for test
   */
  _routes() {
    this.koa.use(this.httpRouter.routes())
  }

  async start(port?: number) {
    this._routes()

    return new Promise<void>((r) => {
      this.httpServer.listen({ port }, () => {
        r()
      })
    })
  }

  useIOMiddleware(...m: ConstructorParameters<typeof IOMiddleware>) {
    this.ioMiddlewares.push(new IOMiddleware(...m))
  }

  async useIO(
    eventName: string,
    handler: (_: IOServer, __: Socket, ...rest: any[]) => any
  ) {
    const layer = new Layer<[IOServer, Socket, ...any[]], any>(handler)
    this.ioMiddlewares.forEach((m) => layer.install(m.handler))
    this.ioServer.on("connection", (socket) => {
      socket.on(eventName, (...rest: any[]) =>
        layer
          .go(this.ioServer, socket, ...rest)
          .then((d) => rest[rest.length - 1]?.(d))
      )
    })
    this.logger.log(`define io event: ${eventName}`)
  }
}
