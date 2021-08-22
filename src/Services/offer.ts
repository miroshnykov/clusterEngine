import {Request, Response} from 'express';
import {getOffer} from '../Models/offer'
import {getCampaign} from '../Models/campaign'

export const offer = async (id: number) => {
  try {
    let offer = await getOffer(id)
    let calculations = {}
    return offer
  } catch (e) {
    console.log('Service offer error:', e)
  }

};