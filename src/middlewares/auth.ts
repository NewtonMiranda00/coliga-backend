import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const Auth = async (req :Request, res :Response, next :NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).send({ error: 'No token provided.' });

    const parts = authHeader.split(' ');

    if (parts.length !== 2)
      return res.status(401).send({ error: 'Token error' });

    const [schema, token] = parts;

    if (!/^Bearer$/i.test(schema))
      return res.status(401).send({ error: 'Token malformatted.' });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if ((<any>decoded).id !== req.params.id)
      return res.status(401).send({
        error: 'This token does not match the requested user.',
      });

    return next();
  } catch (err) {
    return res.status(401).send({ error: 'Token invalid.' });
  }
};

export default Auth;
