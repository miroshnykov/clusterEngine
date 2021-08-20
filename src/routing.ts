import { Request, Response } from 'express';
import { redis } from './redis';

export const offer = async (req: Request, res: Response): Promise<Response> => {
    let data = await redis.get('fileSizeInfo')
    return res.json({ success: true, data: data });
};
