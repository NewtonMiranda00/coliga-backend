import mongoose from '@database/index';

interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  activeAccount: Boolean
  createdAt: Number
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  activeAccount: {
    type: Boolean,
    default: () => false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'users' });

const User = mongoose.model('User', UserSchema);

export default User;