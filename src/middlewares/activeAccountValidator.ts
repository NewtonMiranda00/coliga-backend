import { Request, Response, NextFunction } from 'express';
import isValid from './validators/index';

const ActiveAccountValid = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    const invalid = [];

    // Valid Hash
    if (!isValid.token(String(token))) invalid.push('token');

    if (invalid.length > 0) return res.send({ invalid });

    return next();
  } catch (err) {
    return res.status(400).send({ error: 'Activate account failed.' });
  }
};

export default ActiveAccountValid;
