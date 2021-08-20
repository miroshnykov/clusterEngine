import http, {Server} from 'http'
import cluster, {Worker} from 'cluster'
import {cpus, CpuInfo} from 'os'
import consola from 'consola'
import chalk from 'chalk'
import express, {Application, Request, Response, NextFunction} from 'express'
import * as bodyParser from 'body-parser';
import {offer} from './routing'

// ES6 import or TypeScript
import { io } from "socket.io-client";

const app: Application = express();

let coreThread: CpuInfo[] = cpus();
import 'dotenv/config';

coreThread.length = 1

function loggerMiddleware(request: express.Request, response: express.Response, next:NextFunction) {
    consola.info(`${request.method} ${request.path}`);
    next();
}

consola.info(`Cores number:${coreThread.length}`)
if (cluster.isMaster) {

    let host = 'http://localhost:3001/'
    const socket = io(host);

    socket.on('connect', () => {
        console.log(` *** socket connected, host:${host}`)
    });

    socket.on('fileSizeInfo', async (fileSizeInfo) => {

        try {
            console.log('GET from recipe:',fileSizeInfo)
            socket.emit('sendFileOffer')
        } catch (e) {
            console.log(`fileSizeInfoError:`, e)
        }
    })

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
} else {
    const server = http.createServer(app) as Server
    app.use(loggerMiddleware);
    app.use(bodyParser.json());
    app.get('/health', (req: Request, res: Response, next: NextFunction) => {
        res.send('done')
    });

    app.get('/offer',offer);
    // app.post('/offer', (request:Request, response:Response, next:NextFunction) => {
    //     response.send(request.body);
    // });


    const host: any = process.env.HOST
    const port: any = process.env.PORT
    server.listen(port, host, (): void => consola.success(`server is running on ${port}`))
}