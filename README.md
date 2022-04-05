# 模板介绍

## 目录结构

```
mz-rollup-template
├── script // 打包发布配置
  └── publish.js
├── public // 前端依赖库调试目录
  └── index.html
├── package.json
├── index.js // 函数库的入口
├── README.md // 说明文档
├── tsconfig.json // tsconfig配置
├── api-extractor.json // 生成统一类型定义配置
├── .gitignore
├── .npmignore
└── rollup.config.js // 打包配置
```

## api-extractor
使用 `api-extractor` 生产统一类型定义配置