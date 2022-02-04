import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Request } from '@interfaces/index';



const Auth = async (req :Request, res :Response, next :NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).send({ error: 'No token provided.' });

    const parts = authHeader.split(' ');

    if (parts.length !== 2)
      return res.status(401).send({ error: 'Token error' });

    const [ schema, token ] = parts;

    if (!/^Bearer$/i.test(schema))
      return res.status(401).send({ error: 'Token malformatted.' });

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded: any) => {
      if (err) return res
        .status(401)
        .send({ error: 'Token malformatted' });

      req.userId = decoded.id;

      return next();
    });
  } catch (err) {
    return res.status(401).send({ error: 'Token invalid.' });
  }
};

export default Auth;
