import {
    AutomatiskOpprettetGrunn,
    TiltaksdeltakerEndring,
    TiltaksdeltakerEndringType,
} from '~/types/Revurdering';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Heading, List } from '@navikt/ds-react';
import { formaterDatotekst } from '~/utils/date';

type Props = {
    automatiskOpprettetGrunn: AutomatiskOpprettetGrunn;
};

export const RevurderingAutomatiskOpprettetGrunn = ({ automatiskOpprettetGrunn }: Props) => {
    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-16'}>
                <Heading size={'small'} level={'3'}>
                    {'Automatisk opprettet revurdering'}
                </Heading>
                <Alert variant={'info'} size={'small'}>
                    {
                        'Revurderingen ble automatisk opprettet på grunn av endringer i tiltaksdeltakelsen'
                    }
                </Alert>
                <List>
                    {automatiskOpprettetGrunn.endringer.map((endring) => (
                        <List.Item key={endring.type}>{endringTekst(endring)}</List.Item>
                    ))}
                </List>
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};

const endringTekst = (endring: TiltaksdeltakerEndring): string => {
    switch (endring.type) {
        case TiltaksdeltakerEndringType.AVBRUTT_DELTAKELSE:
            return 'Deltakelsen er avbrutt';
        case TiltaksdeltakerEndringType.IKKE_AKTUELL_DELTAKELSE:
            return 'Deltakelsen er ikke aktuell';
        case TiltaksdeltakerEndringType.FORLENGELSE:
            return `Deltakelsen har blitt forlenget. Ny sluttdato: ${formaterDatotekst(endring.nySluttdato)}`;
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
