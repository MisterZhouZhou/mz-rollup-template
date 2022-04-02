import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser';
import { resolve } from 'path'
import pkg from "./package.json";

// 前端 or node, 前端项目开始服务
const isF2e = true
// 环境变量
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.ts', // 打包入口
  output: [ // 打包输出
    {
      name: 'VueReactivity', // window.VueReactivity
      file: 'dist/vue.js', // 输出文件路径
      format: 'umd', // 打包模式
      sourcemap: true, // sourceMap
    }
  ],
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