import { MeldekortbehandlingBegrunnelseOgBrev } from '~/lib/meldekort/v2/meldekortbehandling/fritekst-og-innsending/begrunnelse-og-brev/MeldekortbehandlingBegrunnelseOgBrev';
import { MeldekortbehandlingSendOgGodkjenn } from '~/lib/meldekort/v2/meldekortbehandling/send-inn/MeldekortbehandlingSendOgGodkjenn';
import { Separator } from '~/lib/_felles/separator/Separator';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { kanBehandle } from '~/lib/saksbehandler/tilganger';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { MeldeperiodebehandlingType } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingKorrigeringUtfall } from '~/lib/meldekort/v2/meldekortbehandling/fritekst-og-innsending/korrigering-utfall/MeldekortbehandlingKorrigeringUtfall';

export const MeldekortbehandlingFritekstOgSendInn = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { meldeperioder, simulertBeregning, saksbehandler } = useMeldekortbehandling();

    const harKorrigering = meldeperioder.some(
        (it) => it.type === MeldeperiodebehandlingType.KORRIGERING,
    );

    const skalViseUtfallVarsel =
        !!simulertBeregning && harKorrigering && kanBehandle(innloggetSaksbehandler, saksbehandler);

    return (
        <>
            {skalViseUtfallVarsel && (
                <>
                    <MeldekortbehandlingKorrigeringUtfall simulertBeregning={simulertBeregning} />
                    <Separator />
                </>
            )}
            <MeldekortbehandlingBegrunnelseOgBrev />
            <Separator />
            <MeldekortbehandlingSendOgGodkjenn />
        </>
    );
};
