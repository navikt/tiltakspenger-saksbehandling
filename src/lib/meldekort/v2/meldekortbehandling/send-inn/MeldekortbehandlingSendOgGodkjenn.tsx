import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import { MeldekortbehandlingTilBeslutning } from '~/lib/meldekort/v2/meldekortbehandling/fritekst-og-innsending/til-beslutning/MeldekortbehandlingTilBeslutning';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { kanSaksbehandleForMeldekort } from '~/lib/meldekort/utils/MeldekortbehandlingUtils';

export const MeldekortbehandlingSendOgGodkjenn = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const meldekortbehandling = useMeldekortbehandling();

    return (
        <MeldekortbehandlingSeksjon>
            <MeldekortbehandlingSeksjon.FullBredde align={'end'}>
                {kanSaksbehandleForMeldekort(meldekortbehandling, innloggetSaksbehandler) && (
                    <MeldekortbehandlingTilBeslutning />
                )}
            </MeldekortbehandlingSeksjon.FullBredde>
        </MeldekortbehandlingSeksjon>
    );
};
