import http, {Server} from 'http'
import cluster, {Worker} from 'cluster'
import {cpus, CpuInfo} from 'os'
import consola from 'consola'
import chalk from 'chalk'
import express, {Application, Request, Response, NextFunction} from 'express'
import * as bodyParser from 'body-parser';
// import {offer} from './routing'
// import {offer} from './Routes/offer'
import routes from './Routes/index';
import {setOffersToRedis} from './Crons/offersCron'
import {io} from "socket.io-client";

const app: Application = express();

let coreThread: CpuInfo[] = cpus();
import 'dotenv/config';
import {getFileFromBucket} from "./Crons/offersReceipS3Cron";
import {redis} from "./redis";

coreThread.length = 1

function loggerMiddleware(request: express.Request, response: express.Response, next: NextFunction) {
  consola.info(`${request.method} ${request.path}`);
  next();
}

consola.info(`Cores number:${coreThread.length}`)
if (cluster.isMaster) {

  // let host = 'http://localhost:3001/'

  const socketHost: any = process.env.SOCKET_HOST
  const socketPort: any = process.env.SOCKET_PORT

  let host = `http://${socketHost}:${String(socketPort)}`
  // console.log('socketHost:', host)
  // console.log('socketPort:', socketPort)
  const socket = io(host);

  socket.on('connect', () => {
    console.log(`Socket connected, host: ${host}`)
  });

  socket.on('fileSizeOffersCheck', async (offersSize) => {

    try {
      consola.warn('Size offers from recipe and from engine is different  ')
      consola.info('GET from recipe fileSizeOffersCheck:', offersSize)
      consola.info(`Re-download new recipe from S3`)
      setTimeout(getFileFromBucket, 6000)
    } catch (e) {
      console.log(`fileSizeOffersInfoError:`, e)
    }
  })

  const setOffersCheckSize = async () => {
    try {
      let offerSize = await redis.get(`offersSize_`)
      socket.emit('fileSizeOffersCheck', offerSize)
    } catch (e) {
      consola.error(`setOffersCheckSizeError:`, e)
    }
  }
  setInterval(setOffersCheckSize, 9000)

  for (let i = 0; i < coreThread.length; i++) {
    cluster.fork()
  }

  const workersTread: any = []
  for (const id in cluster.workers) {
    workersTread.push(id)
  }

  workersTread.forEach(
    async (pid: number, _: number): Promise<void> => {
      // @ts-ignore
      cluster.workers[pid].send({
        from: 'isMaster',
        type: 'SIGKILL',
        message: 'cleanup is worker dead and change to new worker'
      })
    }
  )

  if (process.env.NODE_ENV !== 'production') {
    cluster.on('online', (worker: Worker): void => {
      if (worker.isConnected()) {
        console.info(`${chalk.greenBright('worker active pid')}: ${worker.process.pid}`)
      }
    })

    cluster.on('exit', (worker: Worker, code: number, signal: string): void => {
      if (worker.isDead()) {
        console.info(`${chalk.redBright('worker dead pid')}: ${worker.process.pid}`)
      }
      cluster.fork()
    })
  }
  if (process.env.ENV === 'development') {
    setInterval(setOffersToRedis, 60000) // 60000 -> 60 sec
  }
  if (process.env.ENV === 'development') {
    setTimeout(getFileFromBucket, 6000)
  }

} else {
  const server = http.createServer(app) as Server
  app.use(loggerMiddleware);
  app.use(bodyParser.json());
  app.get('/health', (req: Request, res: Response, next: NextFunction) => {
    res.send('done')
  });

  app.use(routes);
  const host: any = process.env.HOST
  const port: any = process.env.PORT

  server.listen(port, host, (): void => {
    consola.success(`Server is running on host http://${host}:${port}, env:${process.env.ENV} `)
  })
}