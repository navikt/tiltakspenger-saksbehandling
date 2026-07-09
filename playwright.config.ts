import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './e2e',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Gi god margin for kald `next dev`-kompilering av flere sider i én flyt. */
    timeout: 120_000,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('')`. */
        baseURL: 'http://localhost:3100',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    webServer: {
        command: 'pnpm dev',
        port: 3100,
        /* Alltid start en fersk server slik at env under (fake token + mock-API-url) faktisk
         * gjelder. En allerede kjørende dev-server (uten disse env-variablene) ville ellers blitt
         * gjenbrukt, og getServerSideProps ville redirecte til innlogging. Egen port (3100) gjør at
         * en vanlig `pnpm dev` på 3000 ikke forstyrres. */
        reuseExistingServer: false,
        timeout: 10000,
        env: {
            PORT: '3100',
            /* Skrur av Next dev-indikatoren (se next.config.js) så portalen ikke blokkerer klikk. */
            E2E: 'true',
            /* Bypass Wonderwall/token-validering slik at getServerSideProps ikke redirecter til login. */
            BRUK_LOKAL_FAKE_TOKEN: 'true',
            /* Any absolute URL; Next testmode-proxy fanger opp server-side fetch, så verten treffes aldri. */
            TILTAKSPENGER_SAKSBEHANDLING_API_URL: 'http://sbh-api.test',
        },
    },
});
