import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
    MeldekortbehandlingType,
} from '~/types/meldekort/Meldekortbehandling';
import { Alert, VStack } from '@navikt/ds-react';
import { BeregningOppsummering } from '~/components/beregning-og-simulering/beregning-oppsummering/BeregningOppsummering';
import { SimuleringOppsummering } from '~/components/beregning-og-simulering/simulering-oppsummering/SimuleringOppsummering';
import { SimulertBeregningDetaljer } from '~/components/beregning-og-simulering/detaljer/SimulertBeregningDetaljer';
import { useMeldeperiodeKjede } from '~/components/meldekort/context/MeldeperiodeKjedeContext';
import { MeldeperiodeKjedeProps } from '~/types/meldekort/Meldeperiode';
import { BeregningOgSimuleringHeader } from '~/components/beregning-og-simulering/header/BeregningOgSimuleringHeader';
import { kanBehandle, kanSaksbehandleForMeldekort } from '~/utils/tilganger';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { TilbakekrevingOppsummering } from '~/components/tilbakekreving/TilbakekrevingOppsummering';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
    className?: string;
};

export const MeldekortBeregningOgSimulering = ({ meldekortbehandling, className }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { setMeldeperiodeKjede, sisteMeldekortbehandling } = useMeldeperiodeKjede();

    const {
        status,
        simulertBeregning,
        utbetalingsstatus,
        navkontorNavn,
        navkontor,
        saksbehandler,
        type,
        kanIkkeIverksetteUtbetaling,
        tilbakekrevingId,
    } = meldekortbehandling;

    if (!simulertBeregning) {
        return null;
    }

    const { beregning } = simulertBeregning;

    const beløpDiff = beregning.totalt.nå - (beregning.totalt.før ?? 0);

    const erIverksatt =
        status === MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET ||
        status === MeldekortbehandlingStatus.GODKJENT;

    const skalViseUtfallVarsel =
        kanBehandle(innloggetSaksbehandler, saksbehandler) &&
        type === MeldekortbehandlingType.KORRIGERING &&
        sisteMeldekortbehandling === meldekortbehandling;

    return (
        <VStack className={className} gap={'space-20'}>
            {tilbakekrevingId && <TilbakekrevingOppsummering tilbakekrevingId={tilbakekrevingId} />}
            <BeregningOgSimuleringHeader
                utbetalingsstatus={erIverksatt ? utbetalingsstatus : undefined}
                navkontor={navkontor}
                navkontorNavn={navkontorNavn}
                simulertBeregning={simulertBeregning}
                kanIkkeIverksetteUtbetaling={kanIkkeIverksetteUtbetaling}
                erOmberegning={type === MeldekortbehandlingType.KORRIGERING}
            />
            {skalViseUtfallVarsel && (
                <Alert variant={'warning'} size={'small'}>
                    {utfallTekst(beløpDiff)}
                </Alert>
            )}
            <BeregningOppsummering beregninger={beregning} />
            <SimuleringOppsummering
                simulertBeregning={simulertBeregning}
                behandlingId={meldekortbehandling.id}
                oppdaterBehandlingEllerKjede={(meldeperiodeKjede) =>
                    setMeldeperiodeKjede(meldeperiodeKjede as MeldeperiodeKjedeProps)
                }
                visOppdaterKnapp={kanSaksbehandleForMeldekort(
                    meldekortbehandling,
                    innloggetSaksbehandler,
                )}
            />
            <SimulertBeregningDetaljer simulertBeregning={simulertBeregning} />
        </VStack>
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
