module.exports = {
    plugins: ['css-modules'],
    extends: ['next/core-web-vitals', 'prettier', 'plugin:css-modules/recommended'],
    rules: {
        'css-modules/no-unused-class': ['off'],
    },
};
