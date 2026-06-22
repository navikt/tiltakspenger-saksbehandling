import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import { MeldekortbehandlingTilBeslutning } from '~/lib/meldekort/v2/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingTilBeslutning';
import { MeldekortbehandlingGodkjenn } from '~/lib/meldekort/v2/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingGodkjenn';
import { MeldekortbehandlingUnderkjenn } from '~/lib/meldekort/v2/meldekortbehandling/fritekst-og-innsending/dialoger/MeldekortbehandlingUnderkjenn';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import {
    kanBeslutteForMeldekort,
    kanSaksbehandleForMeldekort,
} from '~/lib/meldekort/utils/MeldekortbehandlingUtils';
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
