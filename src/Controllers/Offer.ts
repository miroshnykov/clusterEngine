import {Request, Response} from 'express';
import {CrudController} from './CrudController';
import {offer} from '../Services/offer'
import consola from 'consola'

export class OfferController extends CrudController {

  public async read(req: Request, res: Response) {
    let responseOffer = await offer(10)
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