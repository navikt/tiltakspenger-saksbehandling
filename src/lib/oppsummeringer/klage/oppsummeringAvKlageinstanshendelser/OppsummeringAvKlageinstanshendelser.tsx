import { VStack } from '@navikt/ds-react';
import { Klageinstanshendelse } from '~/types/Klageinstanshendelse';
import { OppsummeringsPar } from '../../oppsummeringspar/OppsummeringsPar';
import {
    erKlageinstanshendelseAvsluttet,
    erKlageinstanshendelseFeilregistrert,
    erKlageinstanshendelseOmgjøringskravbehandlingAvsluttet,
    klagehendelseTypeTilTekst,
    klagehendelseUtfallTilTekst,
} from '~/utils/KlageinstanshendelseUtils';
import { formaterTidspunkt } from '~/utils/date';

const OppsummeringAvKlageinstanshendelser = (props: { hendelser: Klageinstanshendelse[] }) => {
    return (
        <ul>
            {props.hendelser.map((h) => (
                <li key={h.klagehendelseId}>
                    <VStack gap="space-4">
                        <VStack>
                            <OppsummeringsPar
                                label={'Status'}
                                verdi={`${klagehendelseTypeTilTekst[h.hendelsestype]} - ${formaterTidspunkt(h.opprettet)}`}
                                variant="inline"
                            />
                            <OppsummeringsPar
                                label={'Utfall'}
                                variant="inline"
                                verdi={
                                    erKlageinstanshendelseAvsluttet(h) ||
                                    erKlageinstanshendelseOmgjøringskravbehandlingAvsluttet(h)
                                        ? klagehendelseUtfallTilTekst[h.utfall]
                                        : erKlageinstanshendelseFeilregistrert(h)
                                          ? klagehendelseUtfallTilTekst[h.type]
                                          : '-'
                                }
                            />
                        </VStack>
                    </VStack>
                </li>
            ))}
        </ul>
    );
};

export default OppsummeringAvKlageinstanshendelser;
