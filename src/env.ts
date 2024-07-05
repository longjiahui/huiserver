import { defaultLogger } from './framework/logger'
import dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'

export const initEnv = () => {
    dotenv.config()
    let dotenvFile = path.resolve(
        '..',
        `.env${process.env.NODE_ENV && `.${process.env.NODE_ENV}||''`}`
    )
    defaultLogger.log('process.NODE_ENV: ', process.env.NODE_ENV)
    defaultLogger.log('.env file is loaded')
    if (fs.existsSync(dotenvFile)) {
        dotenv.config({ path: dotenvFile, override: true })
        defaultLogger.log(`${dotenvFile} file is loaded`)
    }
}
