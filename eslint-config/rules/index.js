module.exports = {
  plugins: [],

  settings: {},

  env: {
    es6: true,
    node: true,
    browser: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },

  root: true,

  // Custom rules
  rules: {
    'react/forbid-prop-types': 0, // 禁止在propTypes中使用 'any','array','object' 这三类含糊的类型定义，可以使用arrayOf/shape替代，https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
    'react/jsx-filename-extension': [0, { extensions: ['.jsx'] }], // 包含jsx语法的js文件，需要以.jsx后缀结尾，否者会给出警告，https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/no-deprecated': 0, // 禁止使用react被废弃的方法，https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md
    'react/require-default-props': [1, { forbidDefaultForRequired: true }], // 需要定义非required Props的默认值，否则会给出警告，https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
    'react/prop-types': [2, { ignore: ['store', 'dispatch', 'history', 'location', 'params', 'route', 'routeParams', 'children'] }], // 忽略 redux 和 react-router相关的属性校验
    // https://a11yproject.com/，可访问性检查
    'jsx-a11y/click-events-have-key-events': 0, // 非button元素(element)监听onClick事件时，必须监听onKeyUp/onKeyDown/onKeyPress三个键盘事件中的一个，https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events.md
    'jsx-a11y/no-static-element-interactions': 0, // 给非语义化的静态元素(static element)监听事件时，必须给出对应的role属性，https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
    'jsx-a11y/anchor-is-valid': 1, // 当a标签当button使用时，给出警告，https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    'import/no-named-as-default': 1, // 一个模块（js文件）没有定义export default时，会给出警告，https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
    'import/prefer-default-export': 0, // 一个模块（js文件）只有一个export时必须是export default, https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
    'no-console': 0, // 禁止使用console.log/console.warn/console.error，https://eslint.org/docs/rules/no-console
    'no-multi-assign': 0, // 禁止变量链式连续赋值（a=b=c=0），https://eslint.org/docs/rules/no-multi-assign
    'no-underscore-dangle': 1, // 变量名不能使用_开头
    'consistent-return': 0, // function的返回值类型必须一致，https://cn.eslint.org/docs/rules/consistent-return
    'arrow-body-style': ['error', 'as-needed'], // 箭头函数体只有一行时，不允许使用大括号， https://eslint.org/docs/rules/arrow-body-style
    'no-plusplus': [0, { allowForLoopAfterthoughts: true }], // 禁止使用'++'和'--'操作符，for循环除外，https://eslint.org/docs/rules/no-plusplus
    'array-callback-return': 0, // Array的method（如：reduce、map、sort等）对应的回调函数，必须有return语句，https://eslint.org/docs/rules/array-callback-return
    'no-param-reassign': 0, // 禁止对函数的输入参数赋值，https://eslint.org/docs/rules/no-param-reassign
    'no-restricted-globals': 2, // 禁用全局变量检查，https://eslint.org/docs/rules/no-restricted-globals
    'generator-star-spacing': ['error', 'before'], // generator函数的*号之前需要有空格
  },

};
