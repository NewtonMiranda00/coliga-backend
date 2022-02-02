import { Request, Response, NextFunction } from 'express';
import { validate } from 'email-validator';
import isValid from './validators/index';

interface props {
  name: string
  email: string
  password: string
}

const RegisterValid = (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, email, password,
    }: props = req.body;
    const invalid = [];

    // Valid Name
    if (!isValid.name(name)) invalid.push('name');

    // Valid Email
    if (!validate(email)) invalid.push('email');

    // Valid Password
    if (!isValid.pwd(password)) invalid.push('password');

    if (invalid.length > 0) return res.send({ invalid });

    return next();
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed.' });
  }
};

export default RegisterValid;
