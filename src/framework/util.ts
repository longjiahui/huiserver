import type { ModuleFunction, Module, GuardFunction } from "./type"

export { Layer } from "./layer"
export function createModule(module: ModuleFunction, name = "") {
  return { name, module } satisfies Module as Module
}
export function createGuard<Func extends (...rest: any[]) => GuardFunction>(
  func: Func
) {
  return func as (...rest: Parameters<Func>) => GuardFunction
}
