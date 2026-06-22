import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import {
    MeldekortbehandlingStatus,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { kanBehandle } from '~/lib/saksbehandler/tilganger';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { TilbakekrevingOppsummering } from '~/lib/tilbakekreving/TilbakekrevingOppsummering';
import { BeregningOppsummering } from '~/lib/beregning-og-simulering/beregning-oppsummering/BeregningOppsummering';
import { SimuleringOppsummering } from '~/lib/beregning-og-simulering/simulering-oppsummering/SimuleringOppsummering';
import { SimulertBeregningDetaljer } from '~/lib/beregning-og-simulering/detaljer/SimulertBeregningDetaljer';
import { BeregningOgSimuleringHeader } from '~/lib/beregning-og-simulering/header/BeregningOgSimuleringHeader';

export const MeldekortbehandlingBeregningOgSimulering = () => {
    const { erReadonly } = useMeldekortbehandlingSkjema();

    const {
        simulertBeregning,
        saksbehandler,
        tilbakekrevingId,
        status,
        id,
        utbetalingsstatus,
        navkontorNavn,
        navkontor,
        kanIkkeIverksetteUtbetaling,
        meldeperioder,
    } = useMeldekortbehandling();

    const { innloggetSaksbehandler } = useSaksbehandler();

    if (!simulertBeregning) {
        return (
            <Infokort>
                {'Beregning mangler. Behandlingen må lagres med gyldige data for å beregnes.'}
            </Infokort>
        );
    }

    const { beregning } = simulertBeregning;

    const beløpDiff = beregning.totalt.nå - (beregning.totalt.før ?? 0);

    const erIverksatt =
        status === MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET ||
        status === MeldekortbehandlingStatus.GODKJENT;

    const harKorrigering = meldeperioder.some(
        (it) => it.type === MeldeperiodebehandlingType.KORRIGERING,
    );

    const skalViseUtfallVarsel =
        harKorrigering && kanBehandle(innloggetSaksbehandler, saksbehandler);

    return (
        <MeldekortbehandlingSeksjon>
            <MeldekortbehandlingSeksjon.Venstre gap={'space-32'}>
                <BeregningOppsummering beregninger={beregning} />
                <SimuleringOppsummering
                    simulertBeregning={simulertBeregning}
                    behandlingId={id}
                    visOppdaterKnapp={!erReadonly}
                />
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre>
                {/* Denne burde ikke vises her, bør ha en egen seksjon kanskje? */}
                {tilbakekrevingId && (
                    <TilbakekrevingOppsummering tilbakekrevingId={tilbakekrevingId} />
                )}
                {skalViseUtfallVarsel && (
                    <Infokort data-color={'warning'}>{utfallTekst(beløpDiff)}</Infokort>
                )}
                <BeregningOgSimuleringHeader
                    utbetalingsstatus={erIverksatt ? utbetalingsstatus : undefined}
                    navkontor={navkontor}
                    navkontorNavn={navkontorNavn}
                    simulertBeregning={simulertBeregning}
                    kanIkkeIverksetteUtbetaling={kanIkkeIverksetteUtbetaling}
                    erOmberegning={harKorrigering}
                />
                <SimulertBeregningDetaljer simulertBeregning={simulertBeregning} />
            </MeldekortbehandlingSeksjon.Høyre>
        </MeldekortbehandlingSeksjon>
    );
};

const utfallTekst = (beløpDiff: number) => {
    if (beløpDiff < 0) {
        return 'Vurder å sende forhåndsvarsling til bruker om mulig tilbakebetaling i tilbakekrevingsløsningen eller via brevløsningen i Gosys.';
    }

    if (beløpDiff > 0) {
        return 'Husk å informere bruker om etterbetalingen og konsekvensene av det i Modia.';
    }

    return 'Husk å informere bruker om utfallet av korrigeringen i Modia selv om det ikke vil ha en praktisk betydning for utbetalingen.';
};
