import express from 'express';
import routes from '@routes/index';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.get('/', (req, res) => {
  return res.send({ Hello: 'World!' });
});

app.listen(PORT, () => 
  console.log(`Rest API running in PORT: ${PORT}`)
);
