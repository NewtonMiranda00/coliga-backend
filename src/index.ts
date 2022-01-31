import express, { Request, Response } from 'express';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  return res.send({ Hello: 'World!' });
});

app.listen(PORT, () => 
  console.log(`Rest API running in PORT: ${PORT}`)
);

