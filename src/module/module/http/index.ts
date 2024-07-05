import type { Module } from '../../../framework/type'
import primaryHttpMiddleware from './primaryHttpMiddleware'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import validatorGuard from './validatorGuard'

export default ((app) => {
    app.koa.use(cors())
    app.koa.use(bodyParser())

    app.use(primaryHttpMiddleware)
    app.use(validatorGuard)
}) as Module
