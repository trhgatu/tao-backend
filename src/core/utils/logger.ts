// src/core/utils/logger.ts
/* eslint-disable no-console */
import chalk from 'chalk'
import dayjs from 'dayjs'

const timestamp = () => dayjs().format('HH:mm:ss')

const log = {
  info: (msg: string) => {
    console.log(`${chalk.gray(`[${timestamp()}]`)} ${chalk.cyan('[INFO]')} ${msg}`)
  },
  warn: (msg: string) => {
    console.warn(`${chalk.gray(`[${timestamp()}]`)} ${chalk.yellow('[WARN]')} ${msg}`)
  },
  error: (msg: string) => {
    console.error(`${chalk.gray(`[${timestamp()}]`)} ${chalk.red('[ERROR]')} ${msg}`)
  }
}

export default log
