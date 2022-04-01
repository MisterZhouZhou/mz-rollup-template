import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2'
import serve from 'rollup-plugin-serve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import { resolve } from 'path'

// 环境变量
const env = process.env.NODE_ENV;

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
    env === 'development' ? serve({ // 开启服务
      open: false,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: '',
    }) : null,
  ]
}
