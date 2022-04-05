import { defineConfig } from 'rollup'
import rollupResolve from '@rollup/plugin-node-resolve';
import rollupReplace from '@rollup/plugin-replace'
import rollupCommonjs from '@rollup/plugin-commonjs'
import rollupTypescript from 'rollup-plugin-typescript2'
import serve from 'rollup-plugin-serve'
import { terser as rollupTerser } from 'rollup-plugin-terser';
import { resolve } from 'path'
import pkg from "./package.json";

// 环境变量
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// 不需打包的依赖
const externalDeps = Object.keys(pkg.dependencies || {})

const banner = `/* ${pkg.name} version is ${pkg.version} commonjs */`;
const footer = '/* email: 16619930394@163.com */';
// module.export 兼容es5默认导出
// const footer = 'module.exports = Object.assign(exports.default, exports);\n/* email: 16619930394@163.com */';

/**
 * @param {OutputFormat} format
 * @returns {string}
 */
function replaceProcessNodeEnv(format) {
  switch (format) {
    case 'umd':
    case 'cjs':
      return isProduction
        ? '"production"'
        : '"development"'
    case 'esm':
      return 'process.env.NODE_ENV'
    default:
      throw new TypeError(`Unsupport format: ${format}`)
  }
}

/**
* @param {OutputFormat} format
* @returns {string}
*/
function replaceDev(format) {
  switch (format) {
    case 'umd':
    case 'cjs':
      return isProduction ? 'false' : 'true'
    case 'esm':
      return 'process.env.NODE_ENV !== "production"'
    default:
      throw new TypeError(`Unsupport format: ${format}`)
  }
}

/**
 * 创建输入输出格式
 * @param {OutputFormat} format
 * @returns {RollupOptions}
 */
function createOption(format, outputFile) {
  // umd
  const isUMD = format === 'umd'
  // plugins
  const plugins = isUMD ? [
    rollupResolve(),
    rollupReplace({
      preventAssignment: true,
      'process.env.NODE_ENV': replaceProcessNodeEnv(format),
      __DEV__: replaceDev(format),
      __VERSION__: JSON.stringify(pkg.version)
    }),
    rollupCommonjs(),
    rollupTypescript(),
    isProduction && rollupTerser({
      output: {
        comments: false
      },
      module: false
    }) // 压缩代码
  ] : [
    rollupTypescript(),
    isDevelopment && serve({ // 开启服务
      open: true, // 打开浏览器
      openPage: '/public/index.html', // 默认打开的页面
      port: 3000, // 端口号
      contentBase: '',
    }),
    isProduction && rollupTerser({
      output: {
        comments: false
      },
      module: format === 'esm'
    }), // 压缩代码
  ]
  // config
  const config = {
    input: resolve(__dirname, 'src/index.ts'), // 文件编译入口
    output: {
      file: outputFile, // 打包输出路径
      format, // 编译模式
      exports: 'auto', // 导出方式
      ...externalDeps.length && { external: externalDeps }, // 忽略编译的依赖
      banner, // 顶部提示
      footer, // 底部提示,
    },
    plugins, // 插件
  }
  if (isUMD) {
    config.output.name = 'VueReactivity'
    config.output.exports = 'named'
  }
  return config
}

export default defineConfig([
  createOption('umd', pkg.browser),
  createOption('cjs', pkg.main),
  createOption('esm', pkg.module),
])
