import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
    MeldekortBehandlingType,
} from '~/types/meldekort/MeldekortBehandling';
import { Alert, VStack } from '@navikt/ds-react';
import { BeregningOppsummering } from '~/components/beregning-og-simulering/beregning-oppsummering/BeregningOppsummering';
import { SimuleringOppsummering } from '~/components/beregning-og-simulering/simulering-oppsummering/SimuleringOppsummering';
import { SimuleringDetaljer } from '~/components/beregning-og-simulering/detaljer/SimuleringDetaljer';
import { useMeldeperiodeKjede } from '~/components/meldekort/MeldeperiodeKjedeContext';
import { MeldeperiodeKjedeProps } from '~/types/meldekort/Meldeperiode';
import { BeregningOgSimuleringHeader } from '~/components/beregning-og-simulering/header/BeregningOgSimuleringHeader';
import { kanBehandle, kanSaksbehandleForMeldekort } from '~/utils/tilganger';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
    className?: string;
};

export const MeldekortBeregningOgSimulering = ({ meldekortBehandling, className }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { setMeldeperiodeKjede, sisteMeldekortBehandling } = useMeldeperiodeKjede();

    const {
        status,
        simulertBeregning,
        utbetalingsstatus,
        navkontorNavn,
        navkontor,
        saksbehandler,
        type,
    } = meldekortBehandling;

    if (!simulertBeregning) {
        return null;
    }

    const { beregning, simulerteBeløp } = simulertBeregning;

    const beløpDiff = beregning.totalt.nå - (beregning.totalt.før ?? 0);

    const erIverksatt =
        status === MeldekortBehandlingStatus.AUTOMATISK_BEHANDLET ||
        status === MeldekortBehandlingStatus.GODKJENT;

    const skalViseUtfallVarsel =
        kanBehandle(innloggetSaksbehandler, saksbehandler) &&
        type === MeldekortBehandlingType.KORRIGERING &&
        sisteMeldekortBehandling === meldekortBehandling;

    return (
        <VStack className={className} gap={'5'}>
            <BeregningOgSimuleringHeader
                utbetalingsstatus={erIverksatt ? utbetalingsstatus : undefined}
                navkontor={navkontor}
                navkontorNavn={navkontorNavn}
                simulertBeregning={simulertBeregning}
                erOmberegning={type === MeldekortBehandlingType.KORRIGERING}
            />

            {skalViseUtfallVarsel && (
                <Alert variant={'warning'} size={'small'}>
                    {utfallTekst(beløpDiff)}
                </Alert>
            )}

            <BeregningOppsummering beregninger={beregning} />
            <SimuleringOppsummering
                simulerteBeløp={simulerteBeløp}
                behandlingId={meldekortBehandling.id}
                oppdaterBehandlingEllerKjede={(meldeperiodeKjede) =>
                    setMeldeperiodeKjede(meldeperiodeKjede as MeldeperiodeKjedeProps)
                }
                visOppdaterKnapp={kanSaksbehandleForMeldekort(
                    meldekortBehandling,
                    innloggetSaksbehandler,
                )}
            />

            <SimuleringDetaljer simulertBeregning={simulertBeregning} />
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

// TODO: reimplementer disse?
// const OppsummeringAvSimulering = () => {
//     const erFeilutbetalingStørreEnn0 =
//         erSimuleringEndring(props.simulering) && props.simulering.totalFeilutbetaling > 0;
//
//     return (
//         <VStack gap="6">
//             {erFeilutbetalingStørreEnn0 && (
//                 <Alert variant={'warning'} size="small">
//                     Denne behandlingen vil føre til feilutbetaling eller trekk for bruker.
//                     Saksbehandler bør se nøye over simuleringen for å vurdere konsekvensen for
//                     bruker og i noen tilfeller må man opprette en JIRA-sak hos Økonomi slik at de
//                     får endret utbetalingen til ønsket resultat.
//                 </Alert>
//             )}
//             {props.simulering.type === 'IngenEndring' && <OppsummeringAvSimuleringIngenEndring />}
//         </VStack>
//     );
// };
//
// const OppsummeringAvSimuleringIngenEndring = () => {
//     return (
//         <div>
//             <BodyShort>Simuleringen har ført til ingen endring</BodyShort>
//         </div>
//     );
// };
