import type { Module } from '../../framework/type'
import primaryHttpMiddleware from './primaryHttpMiddleware'
import bodyParser from 'koa-bodyparser'
import validatorGuard from './validatorGuard'

export default ((app) => {
    app.koa.use(bodyParser())

    app.use(primaryHttpMiddleware)
    app.use(validatorGuard)
}) as Module
