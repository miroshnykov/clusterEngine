import {Request, Response} from 'express';
import {getOffer} from '../Models/offersModel'
import {getCampaign} from '../Models/campaignsModel'

export const offersServices = async (id: number) => {
  try {
    let offer = await getOffer(id)
    let calculations = {}
    return offer
  } catch (e) {
    console.log('Service offer error:', e)
  }

};