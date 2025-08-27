export type ValideringResultat = {
    errors: string[];
    warnings: string[];
};

export type ValideringType = 'lagring' | 'tilBeslutning';

export type ValideringFunc = (type: ValideringType) => ValideringResultat;
