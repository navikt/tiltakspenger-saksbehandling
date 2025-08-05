export interface SattPåVentBegrunnelse {
    sattPåVentAv: string;
    tidspunkt: string;
    begrunnelse: string;
}

export interface SattPåVent {
    erSattPåVent: boolean;
    sattPåVentBegrunnelse: SattPåVentBegrunnelse;
}
