import { Button, HStack, InlineMessage, VStack } from '@navikt/ds-react';
import { useRolleForBehandling } from '~/lib/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { BehandlingLagringProps } from '~/lib/rammebehandling/felles/handlinger/lagre/useHentBehandlingLagringProps';
import { RammebehandlingSaksbehandlerHandlinger } from '~/lib/rammebehandling/felles/handlinger/RammebehandlingSaksbehandlerHandlinger';
import { formaterTidspunkt } from '~/utils/date';
import { Rammebehandling, SkalJournalføreNotat } from '~/lib/rammebehandling/typer/Rammebehandling';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { useBehandlingSkjema } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { RammebehandlingUnderkjenn } from '~/lib/rammebehandling/felles/handlinger/underkjenn/RammebehandlingUnderkjenn';
import { RammebehandlingGodkjenn } from '~/lib/rammebehandling/felles/handlinger/godkjenn/RammebehandlingGodkjenn';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { isEqualJson } from '~/utils/is-equal-json';

type Props = {
    behandling: Rammebehandling;
    lagringProps: BehandlingLagringProps;
};

export const RammebehandlingHandlinger = ({ behandling, lagringProps }: Props) => {
    const rolleForBehandling = useRolleForBehandling(behandling);
    const { setBehandling } = useBehandling();
    const { skalJournalføreNotat } = useBehandlingSkjema();

    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;
    const erBeslutter = rolleForBehandling === SaksbehandlerRolle.BESLUTTER;

    const harUlagredeEndringer = !isEqualJson(
        skalJournalføreNotat,
        behandling.skalJournalføreNotat,
    );

    const lagreApi = useFetchJsonFraApi<
        Rammebehandling,
        { skalJournalføreNotat: SkalJournalføreNotat }
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/beslutter/oppdater`, 'POST', {
        onSuccess: (oppdatertBehandling) => {
            setBehandling(oppdatertBehandling);
        },
    });

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-16'}>
                {erSaksbehandler && (
                    <RammebehandlingSaksbehandlerHandlinger
                        behandling={behandling}
                        lagringProps={lagringProps}
                    />
                )}

                {erBeslutter && (
                    <VStack gap={'space-16'}>
                        {harUlagredeEndringer && (
                            <Infokort variant={'info'} size={'small'}>
                                Endringer i journalføring av notat må lagres før behandlingen kan
                                godkjennes
                            </Infokort>
                        )}
                        {lagreApi.error && (
                            <Infokort variant={'feil'} size={'small'}>
                                Feil ved lagring: {lagreApi.error.message} (kode{' '}
                                {lagreApi.error.status})
                            </Infokort>
                        )}
                        <HStack gap={'space-16'} justify={'end'}>
                            <RammebehandlingUnderkjenn behandling={behandling} />
                            {harUlagredeEndringer && (
                                <Button
                                    variant={'secondary'}
                                    loading={lagreApi.isMutating}
                                    onClick={() => lagreApi.trigger({ skalJournalføreNotat })}
                                >
                                    Lagre
                                </Button>
                            )}
                            {erBeslutter && (
                                <RammebehandlingGodkjenn disabled={harUlagredeEndringer} />
                            )}
                        </HStack>
                    </VStack>
                )}
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre>
                <InlineMessage status={'info'}>
                    Sist lagret: {formaterTidspunkt(behandling.sistEndret)}
                </InlineMessage>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
