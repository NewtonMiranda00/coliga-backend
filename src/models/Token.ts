import crypto from 'crypto';
import mongoose from '@database/index';

interface IToken extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  typeReq: string
  used: Boolean
  hash: string
  expires?: Number
  createdAt?: Number
}

const TokenSchema = new mongoose.Schema<IToken>({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  typeReq: {
    // ActiveAccount(E-mail)  | ResetPassword
    type: String,
    required: true,
  },
  used: {
    type: Boolean,
    default: () => false,
  },
  hash: {
    type: String,
    default: () => crypto.randomBytes(20).toString('hex'),
    select: false,
  },
  expires: {
    type: Date,
    default: () => {
      const now = new Date();

      return now.setHours(now.getHours() + 2);
    },
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'tokens' });

const Token = mongoose.model('Token', TokenSchema);

export default Token;