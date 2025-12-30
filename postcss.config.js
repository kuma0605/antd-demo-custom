export default {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16, // 基准值，1rem = 16px（与 screenAdaptive.ts 配合使用）
      unitPrecision: 5, // rem 的小数位数
      propList: ['*'], // 需要转换的属性列表，* 表示所有属性
      selectorBlackList: [
        // 忽略的选择器（Ant Design 和 Tailwind 的类名不转换）
        /^\.ant-/,
        /^\.antd-/,
        /^\.tw-/,
      ],
      replace: true, // 是否替换而不是添加
      mediaQuery: false, // 是否在媒体查询中转换 px
      minPixelValue: 1, // 小于 1px 的值不转换（避免边框等小值被转换）
      exclude: /node_modules/i, // 排除 node_modules 目录
    },
  },
}
