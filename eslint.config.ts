import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import css from '@eslint/css';
import nextConfig from 'eslint-config-next';

export default [
    {
        ignores: ['dist', '*.cjs', '*.mjs', '*.js', 'tests', '.next'],
    },
    ...nextConfig,
    {
        files: ['src/**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                ...globals.browser,
                ...globals.es2020,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.reduce((acc, c) => ({ ...acc, ...c.rules }), {}),
            'no-undef': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^(_|req|res|next)$' },
            ],
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            'react-hooks/refs': 'off',
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'off',
        },
    },
    {
        files: ['src/**/*.css'],
        plugins: {
            css,
        },
        language: 'css/css',
        rules: {
            ...css.configs.recommended.rules,
            // Denne var litt vel treg med å oppdatere seg når ting faktisk er støttet av de fleste moderne browsere
            'css/use-baseline': 'off',
            'css/no-invalid-at-rules': 'off',
            // Aksel design tokens (CSS custom properties) er definert utenfor prosjektet,
            // skrur dermed av regelen for ukjent variabler for å unngå falske positiver.
            'css/no-invalid-properties': 'off',
        },
    },
];
