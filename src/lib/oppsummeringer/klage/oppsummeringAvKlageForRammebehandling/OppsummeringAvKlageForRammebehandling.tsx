import { Alert, Box, Button, Heading, LocalAlert, VStack } from '@navikt/ds-react';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
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
import { useVisInnstillingsbrevKlagebehandling } from '~/lib/klage/api/KlageApi';

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
            <VStack gap="space-12">
                <Heading size="small">
                    {erKlageOpprettholdelse(klagebehandling)
                        ? 'Behandling - underinstans'
                        : 'Informasjon om klagen'}
                </Heading>
                {erKlageOmgjøring(klagebehandling) && (
                    <OppsummeringAvOmgjøring klagebehandling={klagebehandling} />
                )}
                {erKlageOpprettholdelse(klagebehandling) && (
                    <OppsummeringOpprettholdelse klagebehandling={klagebehandling} />
                )}
            </VStack>
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
    const visInnstillingsBrev = useVisInnstillingsbrevKlagebehandling({
        sakId: props.klagebehandling.sakId,
        klageId: props.klagebehandling.id,
        //denne er safe siden knappen rendres ikke dersom det ikke eksisterer dokumenter
        dokumentInfoId: props.klagebehandling.resultat.dokumentInfoIder?.at(0) ?? '',
        onSuccess: (blob) => {
            window.open(URL.createObjectURL(blob));
        },
    });

    return (
        <VStack gap="space-20" align="start">
            {props.klagebehandling.resultat.dokumentInfoIder?.length === 0 && null}
            {props.klagebehandling.resultat.dokumentInfoIder?.length === 1 && (
                <Button
                    size="small"
                    variant="secondary"
                    type="button"
                    onClick={() => visInnstillingsBrev.trigger()}
                    loading={visInnstillingsBrev.isMutating}
                >
                    Se innstillingsbrev
                </Button>
            )}
            {(props.klagebehandling.resultat.dokumentInfoIder?.length ?? 0) > 1 && (
                <LocalAlert status="announcement" size="small">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Flere innstillingsbrev</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        Det er registrert flere dokumenter for klagens journalpost. Det er ikke
                        mulig å vise innstillingsbrev i denne situasjonen. Du kan finne
                        innstillingsbrevet ved å gå inn i Gosys
                    </LocalAlert.Content>
                </LocalAlert>
            )}
            {visInnstillingsBrev.error && (
                <LocalAlert status="error" size="small">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Feil ved visning av innstillingsbrev</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>{visInnstillingsBrev.error.message}</LocalAlert.Content>
                </LocalAlert>
            )}
            <VStack>
                <Heading size="small">Behandling - Klageinstansen</Heading>
                <OppsummeringAvKlageinstanshendelser
                    hendelser={props.klagebehandling.resultat.klageinstanshendelser}
                />
            </VStack>
        </VStack>
    );
};
