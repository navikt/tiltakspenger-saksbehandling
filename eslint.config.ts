import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import css from '@eslint/css';

const parserOptions = {
    ecmaVersion: 'latest',
    sourceType: 'module',
};

export default [
    {
        ignores: ['dist', '*.cjs', '*.mjs', '*.js', 'tests', '.next'],
    },
    {
        files: ['src/**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions,
            globals: {
                ...globals.browser,
                ...globals.es2020,
            },
        },
        plugins: {
            react,
            '@typescript-eslint': tseslint,
            'react-hooks': reactHooks,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'no-undef': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^(_|req|res|next)$' },
            ],
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
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
