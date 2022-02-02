import { Router } from 'express';
import { resolve } from 'path';
import { readdirSync } from 'fs';

const routes = Router();

const path = resolve('src', 'routes');

const getRoutes = async (file: string) => {
  const routeName = file.replace('.ts', '');
  routes.use(`/${routeName}`, (await import(`./${routeName}`)).default);
}; // Aplicar recursividade para diretórios com rotas

readdirSync(path)
  .filter((file: string) => (
    file.indexOf('.') !== 1 && file !== 'index.ts'
  ))
  .forEach(getRoutes);

export default routes;
