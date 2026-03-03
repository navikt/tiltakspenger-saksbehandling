import { Heading, VStack } from '@navikt/ds-react';
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

const OppsummeringAvKlageinstanshendelser = (props: {
    hendelser: Klageinstanshendelse[];
    medTittel?: boolean;
}) => {
    return (
        <>
            {props.medTittel && <Heading size="xsmall">Hendelseslogg</Heading>}
            <ul>
                {props.hendelser.map((h) => (
                    <li key={h.klagehendelseId}>
                        <VStack gap="space-4">
                            <VStack>
                                <OppsummeringsPar
                                    label={'Type'}
                                    verdi={klagehendelseTypeTilTekst[h.hendelsestype]}
                                />
                                <OppsummeringsPar
                                    label={'Utfall'}
                                    verdi={
                                        erKlageinstanshendelseAvsluttet(h) ||
                                        erKlageinstanshendelseOmgjøringskravbehandlingAvsluttet(h)
                                            ? klagehendelseUtfallTilTekst[h.utfall]
                                            : erKlageinstanshendelseFeilregistrert(h)
                                              ? klagehendelseUtfallTilTekst[h.type]
                                              : '-'
                                    }
                                />
                                <OppsummeringsPar
                                    label={'Tidspunkt'}
                                    verdi={formaterTidspunkt(h.opprettet)}
                                />
                            </VStack>
                        </VStack>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default OppsummeringAvKlageinstanshendelser;
