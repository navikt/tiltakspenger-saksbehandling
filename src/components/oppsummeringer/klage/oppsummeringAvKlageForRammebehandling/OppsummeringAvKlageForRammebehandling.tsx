import { Alert, Box, Heading, VStack } from '@navikt/ds-react';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import {
    Klagebehandling,
    KlagebehandlingResultat,
    KlagebehandlingsresultatOmgjør,
    KlagebehandlingsresultatOpprettholdt,
} from '~/types/Klage';
import { omgjøringsårsakTilText } from '~/utils/tekstformateringUtils';
import { OppsummeringsPar } from '../../oppsummeringspar/OppsummeringsPar';
import { erKlageOmgjøring, erKlageOpprettholdelse } from '~/utils/klageUtils';
import OppsummeringAvKlageinstanshendelser from '../oppsummeringAvKlageinstanshendelser/OppsummeringAvKlageinstanshendelser';

const OppsummeringAvKlageForRammebehandling = () => {
    const { behandling, klagebehandling } = useBehandling();

    if (!behandling.klagebehandlingId && !klagebehandling) {
        return null;
    }

    if (!klagebehandling || klagebehandling?.resultat?.type === KlagebehandlingResultat.AVVIST) {
        return (
            <Alert variant={'error'}>
                Forventet at behandlingen har en tilknyttet klagebehandling med resultat
                &apos;OMGJØR&apos; eller &apos;OPPRETTHOLD&apos;. men fikk resultat:{' '}
                {klagebehandling?.resultat?.type}
            </Alert>
        );
    }

    return (
        <Box background="default" padding="space-16">
            <Heading size="small">Informasjon fra klagen</Heading>
            {erKlageOmgjøring(klagebehandling) && (
                <OppsummeringAvOmgjøring klagebehandling={klagebehandling} />
            )}
            {erKlageOpprettholdelse(klagebehandling) && (
                <OppsummeringOpprettholdelse klagebehandling={klagebehandling} />
            )}
        </Box>
    );
};

export default OppsummeringAvKlageForRammebehandling;

const OppsummeringAvOmgjøring = (props: {
    klagebehandling: Klagebehandling & { resultat: KlagebehandlingsresultatOmgjør };
}) => {
    return (
        <VStack gap="space-4">
            <OppsummeringsPar
                retning="vertikal"
                label="Årsak"
                verdi={omgjøringsårsakTilText[props.klagebehandling.resultat.årsak]}
            />
            <OppsummeringsPar
                retning="vertikal"
                label="Begrunnelse"
                verdi={props.klagebehandling.resultat.begrunnelse}
            />
        </VStack>
    );
};

const OppsummeringOpprettholdelse = (props: {
    klagebehandling: Klagebehandling & { resultat: KlagebehandlingsresultatOpprettholdt };
}) => {
    return (
        <VStack gap="space-4" align="start">
            <OppsummeringAvKlageinstanshendelser
                hendelser={props.klagebehandling.resultat.klageinstanshendelser}
                medTittel
            />
        </VStack>
    );
};
