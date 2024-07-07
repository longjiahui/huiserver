import type { Module } from '../framework/type'
import http from './http'

export default ((app) => {
    // submodule
    app.use(http)
}) as Module
