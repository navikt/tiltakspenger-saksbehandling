import {
    TiltaksdeltakerEndring,
    TiltaksdeltakerEndringType,
} from '~/lib/rammebehandling/typer/Revurdering';
import { formaterDatotekst } from '~/utils/date';

export const endringTekst = (endring: TiltaksdeltakerEndring): string => {
    switch (endring.type) {
        case TiltaksdeltakerEndringType.AVBRUTT_DELTAKELSE:
            return 'Deltakelsen er avbrutt';
        case TiltaksdeltakerEndringType.IKKE_AKTUELL_DELTAKELSE:
            return 'Deltakelsen er ikke aktuell';
        case TiltaksdeltakerEndringType.FORLENGELSE:
            return `Deltakelsen har blitt forlenget. Ny sluttdato: ${formaterDatotekst(endring.nySluttdato)}`;
        case TiltaksdeltakerEndringType.AVKORTET:
            return `Deltakelsen har blitt avkortet. Ny sluttdato: ${formaterDatotekst(endring.nySluttdato)}`;
        case TiltaksdeltakerEndringType.ENDRET_SLUTTDATO:
            return endring.nySluttdato
                ? `Endret sluttdato til ${formaterDatotekst(endring.nySluttdato)}`
                : 'Endret sluttdato (ukjent dato)';
        case TiltaksdeltakerEndringType.ENDRET_STARTDATO:
            return endring.nyStartdato
                ? `Endret startdato til ${formaterDatotekst(endring.nyStartdato)}`
                : 'Endret startdato (ukjent dato)';
        case TiltaksdeltakerEndringType.ENDRET_DELTAKELSESMENGDE: {
            const detaljer = [];

            if (endring.nyDeltakelsesprosent != null) {
                detaljer.push(`${endring.nyDeltakelsesprosent}%`);
            }

            if (endring.nyDagerPerUke != null) {
                detaljer.push(`${endring.nyDagerPerUke} dager per uke`);
            }

            return detaljer.length > 0
                ? `Endret deltakelsesmengde: ${detaljer.join(', ')}`
                : 'Endret deltakelsesmengde (ukjent mengde)';
        }
        case TiltaksdeltakerEndringType.ENDRET_STATUS:
            return `Endret status: ${endring.nyStatus}`;
    }
};
