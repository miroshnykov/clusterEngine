import {Request, Response, NextFunction} from 'express';
import {BaseController} from './BaseController';
import {offersServices} from '../Services/offersServices'
import consola from 'consola'

export class OffersController extends BaseController {

  public async read(req: Request, res: Response, next: NextFunction): Promise<any> {
    const offerId: number = +req.query.offerId! || 0
    let responseOffer = await offersServices(offerId)
    consola.info('responseOffer:', responseOffer)
    consola.info(req.query)

    if (req.query.debug === 'debug') {
      res.status(200).json({
        status: 'success',
        data: JSON.parse(responseOffer!)
      })
      return next()
    }


    let redirectUrl = 'https://www.google.com/'
    consola.info(`redirect to ${redirectUrl}`)
    res.redirect(redirectUrl)

  }
}