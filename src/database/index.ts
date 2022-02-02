import mongoose from 'mongoose';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

expand(config());

mongoose.connect(process.env.URL_DATABASE);

mongoose.Promise = global.Promise;

export default mongoose;
