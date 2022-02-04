import { Request } from '@interfaces/index';
import User from '@models/User';
import { Response } from 'express';

class UserController {
  async show (req: Request, res: Response) {
    const { userId: id } = req
  
    const user = await User.findOne({ id });
    
    if (!user) 
      return res.status(404).send({ error: 'User not found.' });

    
    return res.send({ user });
  }
}

export default new UserController();
