import { MeldekortbehandlingBegrunnelseOgBrev } from '~/lib/meldekort/v2/meldekortbehandling/fritekst-og-innsending/begrunnelse-og-brev/MeldekortbehandlingBegrunnelseOgBrev';
import { MeldekortbehandlingSendOgGodkjenn } from '~/lib/meldekort/v2/meldekortbehandling/send-inn/MeldekortbehandlingSendOgGodkjenn';
import { Separator } from '~/lib/_felles/separator/Separator';

export const MeldekortbehandlingFritekstOgSendInn = () => {
    return (
        <>
            <MeldekortbehandlingBegrunnelseOgBrev />
            <Separator />
            <MeldekortbehandlingSendOgGodkjenn />
        </>
    );
};
