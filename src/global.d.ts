declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            TILTAKSPENGER_SAKSBEHANDLING_API_URL: string;
            GOSYS_URL: string;
            MODIA_PERSONOVERSIKT_URL: string;
            WONDERWALL_ORIGIN: string;
            SAKSBEHANDLING_API_SCOPE: string;
            NAIS_CLUSTER_NAME?: 'dev-gcp' | 'prod-gcp';
        }
    }
}

export {};
