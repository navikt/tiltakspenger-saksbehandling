import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, LocalAlert, VStack } from '@navikt/ds-react';
import { Klagebehandling } from '~/lib/klage/typer/Klage';
import { useForhåndsvisForvaltningsmelding } from '~/lib/klage/api/KlageApi';
import { kanSendeForvaltningsmelding } from '~/lib/klage/utils/klageUtils';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import SendForvaltningsmeldingSkjema from '~/lib/klage/forvaltningsmelding/SendForvaltningsmeldingSkjema';
import { formaterTidspunkt } from '~/utils/date';
import { OppsummeringsPar } from '~/lib/behandling-felles/oppsummeringer/oppsummeringspar/OppsummeringsPar';

const KlageForvaltningsmelding = (props: {
    klage: Klagebehandling;
    onSendt: (klage: Klagebehandling) => void;
}) => {
    const { klage } = props;
    const { innloggetSaksbehandler, erSaksbehandler } = useSaksbehandler();

    const visSendt = useForhåndsvisForvaltningsmelding({
        sakId: klage.sakId,
        klageId: klage.id,
        onSuccess: (blob) => {
            window.open(URL.createObjectURL(blob));
        },
    });

    if (klage.forvaltningsmelding) {
        const { forvaltningsmelding } = klage;
        return (
            <Box>
                <VStack gap="space-24" align="start">
                    <HStack gap="space-24">
                        <OppsummeringsPar
                            label={'Sendt av'}
                            verdi={forvaltningsmelding.saksbehandler}
                            retning="vertikal"
                        />
                        <OppsummeringsPar
                            label={'Tidspunkt sendt'}
                            verdi={formaterTidspunkt(forvaltningsmelding.sendtTidspunkt)}
                            retning="vertikal"
                        />
                        <OppsummeringsPar
                            label={'Journalpost-ID'}
                            verdi={forvaltningsmelding.journalpostId ?? 'Ikke journalført ennå'}
                            retning="vertikal"
                        />
                        <OppsummeringsPar
                            label={'Tidspunkt distribuert'}
                            verdi={
                                forvaltningsmelding.distribusjonstidspunkt
                                    ? formaterTidspunkt(forvaltningsmelding.distribusjonstidspunkt)
                                    : 'Ikke distribuert ennå'
                            }
                            retning="vertikal"
                        />
                    </HStack>
                    <Button
                        type="button"
                        variant="secondary"
                        loading={visSendt.isMutating}
                        icon={<EnvelopeOpenIcon aria-hidden fontSize="1.5rem" />}
                        iconPosition="left"
                        onClick={() => visSendt.trigger({ tekster: [] })}
                    >
                        Vis forvaltningsmelding
                    </Button>
                    {visSendt.error && (
                        <LocalAlert status="error" size="small">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Kunne ikke vise forvaltningsmeldingen
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{visSendt.error.message}</LocalAlert.Content>
                        </LocalAlert>
                    )}
                </VStack>
            </Box>
        );
    }

    if (!erSaksbehandler || !kanSendeForvaltningsmelding(klage, innloggetSaksbehandler)) {
        return (
            <Box>
                <BodyShort>
                    Det er ikke sendt forvaltningsmelding for denne klagebehandlingen.
                </BodyShort>
            </Box>
        );
    }

    return (
        <Box>
            <SendForvaltningsmeldingSkjema
                sakId={klage.sakId}
                klageId={klage.id}
                innsendingsdato={klage.formkrav.innsendingsdato}
                onSendt={props.onSendt}
            />
        </Box>
    );
};

export default KlageForvaltningsmelding;
