import { type Server as HttpServer, createServer } from 'node:http'
import Koa, { type DefaultContext, type DefaultState } from 'koa'
import { Server as IOServer } from 'socket.io'
import KoaRouter from 'koa-router'
import type { v } from '../module/http/validatorGuard'
import type { Logger, Module } from './type'
import { defaultLogger } from './logger'
import mods from '../module'

import { FatalError } from '../error'

export interface ApplicationGuard {
    v: typeof v
}

export class Application {
    public httpServer: HttpServer
    public koa: Koa
    public io: IOServer
    public httpRouter: KoaRouter<DefaultState, DefaultContext>
    public logger: Logger

    public guard: ApplicationGuard = {} as any

    private modAmount = 0

    static async create(...rest: ConstructorParameters<typeof Application>) {
        const ret = new Application(...rest)
        await ret.use(mods)
        return ret
    }

    constructor(
        options: {
            logger?: Logger
        } = {}
    ) {
        this.koa = new Koa()
        this.httpRouter = new KoaRouter<DefaultState, DefaultContext>()
        this.httpServer = createServer(this.koa.callback())
        this.io = new IOServer(this.httpServer, {
            cors: {
                origin: '*',
            },
        })
        this.logger = options.logger ?? defaultLogger
    }

    async use(mod: Module) {
        await mod(this)
        if (mod.name) {
            this.logger.log('module loaded: ', mod.name)
        }
        this.modAmount += 1
        return this
    }

    async start(port?: number) {
        this.koa.use(this.httpRouter.routes())

        return new Promise<void>((r) => {
            this.httpServer.listen({ port }, () => {
                let address = this.httpServer.address()
                if (address && typeof address === 'object') {
                    address = `http://${address.address}:${address.port}`
                }
                this.logger.log(`loaded ${this.modAmount} modules`)
                this.logger.log(`listened: ${address}`)
                r()
            })
        })
    }
}
