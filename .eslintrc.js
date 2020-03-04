module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'space-before-function-paren': ['off'],
        'indent': ['error', 4],
        'curly': ['off'],
        'brace-style': ['off'],
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

        '@typescript-eslint/no-empty-function': [ 'off' ],
        '@typescript-eslint/member-delimiter-style': [ 'off' ]
    }
}
