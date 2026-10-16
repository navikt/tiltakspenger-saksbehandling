import { DateValidationT } from '@navikt/ds-react';

export const datovalideringsfeil = (
    { isValidDate, isEmpty, isBefore }: DateValidationT,
    førMinDatoFeilmelding?: string,
): string | undefined => {
    if (isValidDate || isEmpty) {
        return undefined;
    }

    return isBefore && førMinDatoFeilmelding
        ? førMinDatoFeilmelding
        : 'Skriv inn en gyldig dato (dd.mm.åååå)';
};
