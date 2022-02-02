import { Request, Response, NextFunction } from 'express';
import { validate } from 'email-validator';

interface props {
  email: string
}

const ForgotPasswordValid = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email }: props = req.body;
    const invalid = [];

    // Valid Email
    if (!validate(email)) invalid.push('email');

    if (invalid.length > 0) return res.send({ invalid });

    return next();
  } catch (err) {
    return res.status(400).send({ error: 'Forgot password failed.' });
  }
};

export default ForgotPasswordValid;
