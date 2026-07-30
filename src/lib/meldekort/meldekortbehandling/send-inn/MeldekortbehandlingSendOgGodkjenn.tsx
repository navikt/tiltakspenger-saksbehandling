import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/meldekortbehandling/layout/MeldekortbehandlingSeksjon';
import { MeldekortbehandlingTilBeslutning } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingTilBeslutning';
import { MeldekortbehandlingGodkjenn } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingGodkjenn';
import { MeldekortbehandlingUnderkjenn } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingUnderkjenn';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { useMeldekortbehandling } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import {
    kanBeslutteForMeldekort,
    kanSaksbehandleForMeldekort,
} from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { HStack } from '@navikt/ds-react';

export const MeldekortbehandlingSendOgGodkjenn = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const meldekortbehandling = useMeldekortbehandling();

    return (
        <MeldekortbehandlingSeksjon>
            <MeldekortbehandlingSeksjon.FullBredde align={'end'} gap={'space-16'}>
                {kanSaksbehandleForMeldekort(meldekortbehandling, innloggetSaksbehandler) && (
                    <MeldekortbehandlingTilBeslutning />
                )}
                {kanBeslutteForMeldekort(meldekortbehandling, innloggetSaksbehandler) && (
                    <HStack gap={'space-8'}>
                        <MeldekortbehandlingUnderkjenn />
                        <MeldekortbehandlingGodkjenn />
                    </HStack>
                )}
            </MeldekortbehandlingSeksjon.FullBredde>
        </MeldekortbehandlingSeksjon>
    );
};
