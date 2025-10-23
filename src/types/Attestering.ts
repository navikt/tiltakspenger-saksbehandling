export type Attestering = {
    status: Attesteringsstatus;
    begrunnelse: string;
    endretAv: string;
    endretTidspunkt: string;
};

export enum Attesteringsstatus {
    GODKJENT = 'GODKJENT',
    SENDT_TILBAKE = 'SENDT_TILBAKE',
}
