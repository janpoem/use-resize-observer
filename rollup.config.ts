import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import fs from 'node:fs';
import { join, resolve } from 'node:path';
import type { RollupOptions } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import { swc } from 'rollup-plugin-swc3';

const outputDir = resolve(process.cwd(), './dist');
const srcDir = resolve(process.cwd(), 'src');

const rmdir = (dir: string) =>
  dir &&
  fs.existsSync(dir) &&
  fs.statSync(dir).isDirectory() &&
  fs.rmSync(dir, { recursive: true });

const external = [
  'react',
];

const options: RollupOptions[] = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: join(outputDir, 'index.cjs'),
        format: 'cjs',
      },
      {
        file: join(outputDir, 'index.js'),
        format: 'es',
        exports: 'named',
      },
    ],
    plugins: [
      // @ts-ignore
      rmdir(outputDir),
      swc({
        include: /\.[mc]?[jt]sx?$/,
        exclude: /node_modules/,
        tsconfig: 'tsconfig.json',
        jsc: {
          target: 'es2022',
        },
      }),
      nodeResolve({}),
      commonjs({
        extensions: ['.node', '.cjs', '.js', '.mjs'],
      }),
    ],
    external,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: join(outputDir, 'index.d.ts'),
        format: 'es',
      },
    ],
    plugins: [dts()],
    external,
  },
];


export default options;
