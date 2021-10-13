import { resolve } from 'path';
import { Configuration } from 'webpack';

const conf = {
  prodMode: process.env.NODE_ENV === 'production',
  templatePath: '../../../template.yaml',
};

console.log(`resolve(__dirname, 'index.ts')`);
console.log(resolve(__dirname, 'index.ts'));

const config: Configuration = {
  entry: {
    defaultApiResponses: resolve(__dirname, 'index.ts'),
  },
  target: 'node',
  mode: conf.prodMode ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: { '@': '../../' },
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  plugins: [],
};

export default config;
