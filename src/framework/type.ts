import type { Application } from "./application"
import type { default as Koa } from "koa"

export interface LoggerBase {
  _log(level: "debug" | "log" | "warn" | "error", ...rest: any[]): void
}

export type Logger = LoggerBase &
  Record<Parameters<LoggerBase["_log"]>[0], (...rest: any[]) => void>

export type ModuleFunction = (app: Application) => PromiseLike<any> | any
export interface Module {
  name: string
  module: ModuleFunction
}

export type Context = Parameters<Parameters<Server["use"]>[0]>[0]
export type HttpMiddleware = Parameters<Koa["use"]>[0]
export type Server = Koa

export {}
