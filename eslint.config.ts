import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import css from '@eslint/css';
import nextConfig from 'eslint-config-next';

const restrictedImportPaths = [
    {
        name: '@navikt/ds-react',
        importNames: ['Alert'],
        message:
            'Alert er deprecated. Bruk Infokort (~/lib/_felles/infokort/Infokort) for varselbokser, eller InlineMessage for inline-varsler.',
    },
    {
        name: '@navikt/ds-react',
        importNames: ['Modal'],
        message: 'Modal er deprecated. Bruk Dialog fra @navikt/ds-react.',
    },
];

const restrictedImportPatterns = [
    {
        group: ['**/e2e/**'],
        message: 'App code must not import from the e2e/ folder.',
    },
];

// Dev-koden skal kun lastes via next/dynamic fra src/pages/dev, slik at den ikke havner i prod-bygget.
const devImportMessage =
    'Filer i src/dev skal kun importeres fra src/dev eller src/pages/dev (via next/dynamic bak NODE_ENV === "development").';

const devImportPattern = {
    group: ['~/dev', '~/dev/**', '**/dev', '**/dev/**'],
    message: devImportMessage,
};

// no-restricted-imports fanger ikke dynamiske import(), så de sjekkes via no-restricted-syntax.
const devDynamicImportSyntax = {
    selector: 'ImportExpression[source.value=/(^|\\/)dev(\\/|$)/]',
    message: devImportMessage,
};

const restrictedSyntax = [
    {
        selector: 'TSNonNullExpression',
        message:
            'Non-null assertions skal gjøres runtime. Bruk nonNullish() fra ~/utils/object, eller atNonNull() for array-oppslag.',
    },
];

const eslintConfig = [
    {
        ignores: [
            'dist',
            '*.cjs',
            '*.mjs',
            '*.js',
            'tests',
            '.next',
            '.next-e2e',
            'playwright-report',
            'test-results',
        ],
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
            '@typescript-eslint/no-explicit-any': 'error',
            'no-restricted-syntax': ['error', ...restrictedSyntax, devDynamicImportSyntax],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^(_|req|res|next)$' },
            ],
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            'react-hooks/refs': 'off',
            'no-restricted-imports': [
                'error',
                {
                    paths: restrictedImportPaths,
                    patterns: [...restrictedImportPatterns, devImportPattern],
                },
            ],
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'off',
        },
    },
    {
        files: ['src/dev/**/*.{ts,tsx,js,jsx}', 'src/pages/dev/**/*.{ts,tsx,js,jsx}'],
        rules: {
            'no-restricted-imports': [
                'error',
                { paths: restrictedImportPaths, patterns: restrictedImportPatterns },
            ],
            'no-restricted-syntax': ['error', ...restrictedSyntax],
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

export default eslintConfig;
