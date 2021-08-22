import {Request, Response} from 'express';
import {BaseController} from './BaseController';
import {offersServices} from '../Services/offersServices'
import consola from 'consola'

export class OfferController extends BaseController {

  public async read(req: Request, res: Response) {
    let responseOffer = await offersServices(10)
    consola.info('responseOffer:', responseOffer)
    consola.info(req.query)
    if (req.query.debug === 'debug') {
      res.json({message: responseOffer});
    } else {
      let redirectUrl = 'https://www.google.com/'
      consola.info(`redirect to ${redirectUrl}`)
      res.redirect(redirectUrl)

    }

  }
}