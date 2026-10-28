import { Button, HStack, VStack } from '@navikt/ds-react';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/meldekortbehandling/layout/MeldekortbehandlingSeksjon';
import { MeldekortbehandlingTilBeslutning } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingTilBeslutning';
import { MeldekortbehandlingUnderkjenn } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingUnderkjenn';
import { MeldekortbehandlingGodkjenn } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingGodkjenn';
import { useSak } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { kanBeslutte, kanSaksbehandle } from '~/lib/saksbehandler/tilganger';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const MeldekortbehandlingSendOgGodkjenn = () => {
    const { sak, setSak } = useSak();
    const meldekortbehandling = useMeldekortbehandling();
    const { skalJournalføreNotat } = useMeldekortbehandlingSkjema();

    const harUlagredeEndringer = skalJournalføreNotat !== meldekortbehandling.skalJournalføreNotat;

    const lagreApi = useFetchJsonFraApi<SakProps, { skalJournalføreNotat: boolean }>(
        `/sak/${sak.sakId}/meldekort/${meldekortbehandling.id}/beslutter/oppdater`,
        'POST',
        {
            onSuccess: (oppdatertSak) => {
                setSak(oppdatertSak);
            },
        },
    );

    return (
        <MeldekortbehandlingSeksjon>
            <MeldekortbehandlingSeksjon.FullBredde align={'end'} gap={'space-16'}>
                {kanSaksbehandle(meldekortbehandling) && <MeldekortbehandlingTilBeslutning />}
                {kanBeslutte(meldekortbehandling) && (
                    <VStack gap={'space-8'} align={'end'}>
                        {harUlagredeEndringer && (
                            <Infokort variant={'info'} size={'small'}>
                                Endringer i journalføring av notat må lagres før meldekortet kan
                                godkjennes
                            </Infokort>
                        )}
                        {lagreApi.error && (
                            <Infokort variant={'feil'} size={'small'}>
                                Feil ved lagring: {lagreApi.error.message} (kode{' '}
                                {lagreApi.error.status})
                            </Infokort>
                        )}
                        <HStack gap={'space-8'}>
                            <MeldekortbehandlingUnderkjenn />
                            {harUlagredeEndringer && (
                                <Button
                                    variant={'secondary'}
                                    loading={lagreApi.isMutating}
                                    onClick={() => lagreApi.trigger({ skalJournalføreNotat })}
                                >
                                    Lagre
                                </Button>
                            )}
                            <MeldekortbehandlingGodkjenn
                                disabled={harUlagredeEndringer || lagreApi.isMutating}
                            />
                        </HStack>
                    </VStack>
                )}
            </MeldekortbehandlingSeksjon.FullBredde>
        </MeldekortbehandlingSeksjon>
    );
};
