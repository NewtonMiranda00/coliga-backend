import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '@models/User';
import Token from '@models/Token';

import MailController from '@controllers/MailController';

interface IRegister {
  name: string
  email: string
  password: string
}

interface IAuthenticate {
  email: string
  password: string
}

interface IForgotPassword {
  email: string
}

function generateToken(params = {}) {
  return jwt.sign(params, process.env.SECRET_KEY, {
    expiresIn: 86400,
  });
}

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const {
        name, email, password,
      }: IRegister = req.body;

      if (await User.findOne({ email }))
        return res.status(400).send({ error: 'This email already exists.' });

      const user = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
      });

      user.password = undefined;

      const token = await Token.create({
        userId: user.id,
        typeReq: 'ActiveAccount',
      });

      await MailController.sendActiveAccount(token.hash, { name, email });

      return res.send({
        user,
        token: generateToken({ id: user.id }),
        message: 'We send an account activation link to your email.',
      });
    } catch (err) {
      return res.status(400).send({ error: 'Registration failed.' });
    }
  }

  async activeAccount(req: Request, res: Response) {
    try {
      const { token } = req.query;

      const tkn = await Token.findOne(
        { hash: token, typeReq: 'ActiveAccount' },
      ).select('+hash expires');
      if (!tkn) return res.status(400).send({ error: 'Invalid Token.' });

      if (tkn.used)
        return res.status(400).send(
          { error: 'This token has already been used.' },
        );

      const now = new Date();

      if (tkn.expires <= Number(now)) {
        await Token.deleteOne({ id: tkn.id });

        const { userId, hash } = await Token.create({
          userId: tkn.userId,
          typeReq: 'ActiveAccount',
        });

        const { name, email } = await User.findOne({ id: userId });

        await MailController.sendActiveAccount(hash, { name, email });

        return res.status(400).send({
          error: 'Token expired. A new token has been sent to your email.',
        });
      }

      if (!await User.updateOne({ id: tkn.userId }, { activeAccount: true }))
        return res.status(400).send({ error: 'Failed to activate account.' });

      await Token.deleteOne({ id: tkn.id });

      return res.send({ message: 'Account activated.' });
    } catch (err) {
      return res.status(400).send({ error: 'Activate account failed.' });
    }
  }

  async authenticate(req: Request, res: Response) {
    try {
      const { email, password }: IAuthenticate = req.body;

      const user = await User.findOne({ email }).select('+password');

      if (!user) return res.status(404).send({ error: 'User not found.' });

      if (!user.activeAccount)
        return res.status(400).send({ error: 'Account not activated' });

      if (!(await bcrypt.compare(password, user.password)))
        return res.status(400).send({ error: 'This password is incorrect.' });

      user.password = undefined;

      return res.send({ user, token: generateToken({ id: user.id }) });
    } catch (err) {
      return res.status(400).send({ error: 'Authenticate failed.' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email }: IForgotPassword = req.body;

      const user = await User.findOne({ email });

      if (!user) return res.status(404).send({ error: 'User not found.' });

      const { id, name } = user;

      const resend = await Token.findOne({
        userId: id,
        typeReq: 'ResetPassword',
      }).select('+hash');

      const { hash } = resend || await Token.create({
        userId: id,
        typeReq: 'ResetPassword',
      });

      await MailController.sendTokenResetPassword(hash, { name, email });

      return res.send({});
    } catch (err) {
      return res.status(400).send({ error: 'Forgot password failed.' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, token, password } = req.body;

      const user = await User.findOne({ email }).select('+password');

      if (!user) return res.status(404).send({ error: 'User not found.' });

      const tkn = await Token.findOne({
        userId: user.id,
        typeReq: 'ResetPassword',
      }).select('+hash expires');

      if (!tkn) return res.status(400).send({ error: 'Invalid reset request.' });

      const now = new Date();

      if (Number(tkn.expires) <= Number(now)) {
        await Token.deleteOne({ id: tkn.id });

        const { hash } = await Token.create({
          userId: user.id,
          typeReq: 'ResetPassword',
        });

        const { name } = user;

        await MailController.sendTokenResetPassword(hash, { name, email });

        return res.status(400).send({
          error: 'Token expired. A new token has been sent to your email.',
        });
      }

      if (token !== tkn.hash)
        return res.status(400).send({ error: 'Token invalid.' });

      await Token.deleteOne({ id: tkn.id });

      await User.updateOne({
        id: user.id,
      }, {
        password: await bcrypt.hash(password, 10),
      });

      return res.send({});
    } catch (err) {
      return res.status(400).send({ error: 'Reset password failed.', err });
    }
  }
}

export default new AuthController();