// src/register-alias.ts
import path from 'path';
import moduleAlias from 'module-alias';

const isDev = process.env.NODE_ENV !== 'production';
const basePath = isDev ? 'src' : 'dist';

moduleAlias.addAliases({
  '@modules': path.join(__dirname, `../${basePath}/modules`),
  '@routes': path.join(__dirname, `../${basePath}/routes`),
  '@config': path.join(__dirname, `../${basePath}/config`),
  '@middlewares': path.join(__dirname, `../${basePath}/core/middleware`),
  '@common': path.join(__dirname, `../${basePath}/core/utils`),
  '@shared': path.join(__dirname, `../${basePath}/shared`),
  '@socket': path.join(__dirname, `../${basePath}/socket`),
  '@usecases': path.join(__dirname, `../${basePath}/usecases`),
  '@types': path.join(__dirname, `../${basePath}/core/types`),
});
