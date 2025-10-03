module.exports = {
    plugins: ['css-modules', '@typescript-eslint'],
    extends: [
        'next/core-web-vitals',
        'prettier',
        'plugin:css-modules/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'css-modules/no-unused-class': ['off'],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                varsIgnorePattern: '^_$',
                argsIgnorePattern: '^_$',
            },
        ],
    },
};
