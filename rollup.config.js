import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser';
import { resolve } from 'path'
import { builtinModules } from 'module';
import pkg from "./package.json";

// 前端 or node, 前端项目开始服务
const isF2e = true
// 环境变量
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// 不需打包的依赖
const externalDeps = Object.keys(pkg.dependencies || {}).concat(builtinModules)

const banner = `/* ${pkg.name} version is ${pkg.version} commonjs */`;
// module.export 兼容es5默认导出
const footer = 'module.exports = Object.assign(exports.default, exports);\n/* email: 16619930394@163.com */';

export default {
  input: 'src/index.ts', // 打包入口
  output: [ // 打包输出
    {
      name: 'VueReactivity', // window.VueReactivity
      file: 'dist/vue.js', // 输出文件路径
      format: 'umd', // 打包模式umd,前端使用<script src="">形式引用
      sourcemap: true, // source map用于调试报错定位
    },
    {
      file: pkg.main, // 输出文件路径
      format: 'cjs', // 打包模式
      exports: 'named',
      banner, // 顶部提示
      footer, // 底部提示,
    },
    {
      // dir: "dist/esm", // 与file作用一样，默认入口为index.js
      file: pkg.module, // 输出文件路径
      format: "esm", // es modue, 前端需要使用<script type="module" src="">形式引用
      exports: "named", // 不加可能会有Use `output.exports: 'named'` to disable this warning警告
      sourcemap: true, // source map用于调试报错定位
      banner, // 顶部提示
      footer, // 底部提示,
    },
  ],
  external: externalDeps, // 排除打包依赖
  plugins: [
    nodeResolve({  // 查找和打包node_modules中的第三方模块
      extensions: ['.js', '.ts']
    }),
    commonjs(), // commonjs转es6,有些模块无法通过import导入
    typescript({ // 解析TypeScript
      tsconfig: resolve(__dirname, 'tsconfig.json')
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: [".js", ".ts"],
      exclude: "node_modules/**"
    }),
    replace({ // 替换node环境变量
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    isDevelopment && isF2e && serve({ // 开启服务
      open: true, // 打开浏览器
      openPage: '/public/index.html', // 默认打开的页面
      port: 3000, // 端口号
      contentBase: '',
    }),
    isProduction && terser(), // 压缩代码
  ]
}
