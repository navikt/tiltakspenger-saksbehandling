import { FieldErrors } from 'react-hook-form';
import { AvbrytKlagebehandlingRequest, AvbrytKlagebehandlingStatus } from '../../typer/Klage';

export enum AvbrytKlagebehandlingFormStatus {
    KLAGE_TRUKKET = 'KLAGE_TRUKKET',
    FEILREGISTRER_KLAGE = 'FEILREGISTRER_KLAGE',
    MANGLENDE_UTBETALING = 'MANGLENDE_UTBETALING',
    ANNET = 'ANNET',
}

export const avbrytKlagebehandlingFormStatusLabels: Record<
    AvbrytKlagebehandlingFormStatus,
    string
> = {
    [AvbrytKlagebehandlingFormStatus.KLAGE_TRUKKET]: 'Klagen er trukket',
    [AvbrytKlagebehandlingFormStatus.FEILREGISTRER_KLAGE]: 'Feilregistrert klage',
    [AvbrytKlagebehandlingFormStatus.MANGLENDE_UTBETALING]: 'Manglende utbetaling',
    [AvbrytKlagebehandlingFormStatus.ANNET]: 'Annet',
};

export interface AvbrytKlagebehandlingFormData {
    status: AvbrytKlagebehandlingFormStatus | '';
    begrunnelse: string;
}

export const avbrytKlagebehandlingFormValidation = (data: AvbrytKlagebehandlingFormData) => {
    const errors: FieldErrors<AvbrytKlagebehandlingFormData> = {};

    if (!data.status) {
        errors.status = { type: 'required', message: 'Status er påkrevd' };
    }

    if (
        data.status === AvbrytKlagebehandlingFormStatus.ANNET &&
        (!data.begrunnelse || data.begrunnelse.trim() === '')
    ) {
        errors.begrunnelse = {
            type: 'required',
            message: 'Begrunnelse er påkrevd når status er "Annet"',
        };
    }

    return { values: data, errors: errors };
};

const statusMap: Record<AvbrytKlagebehandlingFormStatus, AvbrytKlagebehandlingStatus> = {
    [AvbrytKlagebehandlingFormStatus.KLAGE_TRUKKET]: AvbrytKlagebehandlingStatus.KLAGE_TRUKKET,
    [AvbrytKlagebehandlingFormStatus.FEILREGISTRER_KLAGE]:
        AvbrytKlagebehandlingStatus.FEILREGISTRER_KLAGE,
    [AvbrytKlagebehandlingFormStatus.MANGLENDE_UTBETALING]:
        AvbrytKlagebehandlingStatus.MANGLENDE_UTBETALING,
    [AvbrytKlagebehandlingFormStatus.ANNET]: AvbrytKlagebehandlingStatus.ANNET,
};

export const avbrytKlagebehandlingFormDataToRequest = (
    data: AvbrytKlagebehandlingFormData,
): AvbrytKlagebehandlingRequest => {
    return {
        status: statusMap[data.status as AvbrytKlagebehandlingFormStatus],
        begrunnelse:
            data.status === AvbrytKlagebehandlingFormStatus.ANNET ? data.begrunnelse : null,
    };
};
