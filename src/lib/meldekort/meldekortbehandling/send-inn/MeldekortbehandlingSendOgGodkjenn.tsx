import { Button, HStack, VStack } from '@navikt/ds-react';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/meldekortbehandling/layout/MeldekortbehandlingSeksjon';
import { MeldekortbehandlingTilBeslutning } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingTilBeslutning';
import { MeldekortbehandlingUnderkjenn } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingUnderkjenn';
import { MeldekortbehandlingGodkjenn } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingGodkjenn';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { useSak } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import {
    kanBeslutteForMeldekort,
    kanSaksbehandleForMeldekort,
} from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const MeldekortbehandlingSendOgGodkjenn = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { sak, setSak } = useSak();
    const meldekortbehandling = useMeldekortbehandling();
    const { skalJournalføreNotat } = useMeldekortbehandlingSkjema();

    const harUlagredeEndringer = skalJournalføreNotat !== meldekortbehandling.skalJournalføreNotat;

    const { trigger, isMutating, error } = useFetchJsonFraApi<
        SakProps,
        { skalJournalføreNotat: boolean }
    >(`/sak/${sak.sakId}/meldekort/${meldekortbehandling.id}/beslutter/oppdater`, 'POST');

    const lagre = () => {
        trigger({ skalJournalføreNotat }).then((oppdatertSak) => {
            if (oppdatertSak) {
                setSak(oppdatertSak);
            }
        });
    };

    return (
        <MeldekortbehandlingSeksjon>
            <MeldekortbehandlingSeksjon.FullBredde align={'end'} gap={'space-16'}>
                {kanSaksbehandleForMeldekort(meldekortbehandling, innloggetSaksbehandler) && (
                    <MeldekortbehandlingTilBeslutning />
                )}
                {kanBeslutteForMeldekort(meldekortbehandling, innloggetSaksbehandler) && (
                    <VStack gap={'space-8'} align={'end'}>
                        {harUlagredeEndringer && (
                            <Infokort variant={'info'} size={'small'}>
                                Endringer i journalføring av notat må lagres før meldekortet kan
                                godkjennes
                            </Infokort>
                        )}
                        {error && (
                            <Infokort variant={'feil'} size={'small'}>
                                Feil ved lagring: {error.message} (kode {error.status})
                            </Infokort>
                        )}
                        <HStack gap={'space-8'}>
                            <MeldekortbehandlingUnderkjenn />
                            {harUlagredeEndringer && (
                                <Button variant={'secondary'} loading={isMutating} onClick={lagre}>
                                    Lagre
                                </Button>
                            )}
                            <MeldekortbehandlingGodkjenn disabled={harUlagredeEndringer} />
                        </HStack>
                    </VStack>
                )}
            </MeldekortbehandlingSeksjon.FullBredde>
        </MeldekortbehandlingSeksjon>
    );
};
