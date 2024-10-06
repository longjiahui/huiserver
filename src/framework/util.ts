import type { ModuleFunction, Module } from "./type"

export { Layer } from "./layer"
export function createModule(module: ModuleFunction, name = "") {
  return { name, module } satisfies Module as Module
}
