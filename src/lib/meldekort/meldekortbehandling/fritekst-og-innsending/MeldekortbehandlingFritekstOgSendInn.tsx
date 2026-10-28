import { MeldekortbehandlingBegrunnelseOgBrev } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/begrunnelse-og-brev/MeldekortbehandlingBegrunnelseOgBrev';
import { MeldekortbehandlingSendOgGodkjenn } from '~/lib/meldekort/meldekortbehandling/send-inn/MeldekortbehandlingSendOgGodkjenn';
import { Separator } from '~/lib/_felles/separator/Separator';
import { useMeldekortbehandling } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { kanSaksbehandle } from '~/lib/saksbehandler/tilganger';
import { MeldeperiodebehandlingType } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingKorrigeringUtfall } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/korrigering-utfall/MeldekortbehandlingKorrigeringUtfall';
import { MeldekortbehandlingPrioritering } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/prioritering/MeldekortbehandlingPrioritering';

export const MeldekortbehandlingFritekstOgSendInn = () => {
    const meldekortbehandling = useMeldekortbehandling();
    const { meldeperioder, simulertBeregning } = meldekortbehandling;

    const harKorrigering = meldeperioder.some(
        (it) => it.type === MeldeperiodebehandlingType.KORRIGERING,
    );

    const skalViseUtfallVarsel =
        !!simulertBeregning && harKorrigering && kanSaksbehandle(meldekortbehandling);

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
            <MeldekortbehandlingPrioritering />
            <Separator />
            <MeldekortbehandlingSendOgGodkjenn />
        </>
    );
};
