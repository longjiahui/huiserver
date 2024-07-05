import type { Module } from '../framework/type'
import http from './module/http'

export default ((app) => {
    // submodule
    app.use(http)
}) as Module
