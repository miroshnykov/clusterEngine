import {Request, Response} from 'express';
import {redis} from "../redis";

export const getCampaign = async (id: number) => {
  try {
    let data = await redis.get(`campaign-${id}`)
    return data
  } catch (e) {

  }
};