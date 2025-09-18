import { BehandlingData, RevurderingData } from '~/types/BehandlingTypes';
import {
    createContext,
    Dispatch,
    PropsWithChildren,
    useCallback,
    useContext,
    useReducer,
    useRef,
} from 'react';
import {
    RevurderingInnvilgelseReducer,
    RevurderingInnvilgelseSkjemaActions,
    RevurderingInnvilgelseSkjemaState,
} from './RevurderingInnvilgelseReducer';
import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { Periode } from '~/types/Periode';
import { VedtakTiltaksdeltakelsePeriode } from '~/types/VedtakTyper';
import {
    hentHeleTiltaksdeltagelsesperioden,
    hentTiltaksdeltakelserMedStartOgSluttdato,
} from '~/utils/behandling';
import { getTextAreaRefValue } from '~/utils/textarea';
import { BarnetilleggBegrunnelseInput } from '~/components/behandling/felles/state/BarnetilleggState';
import { BegrunnelseOgBrevInput } from '~/components/behandling/felles/state/BegrunnelseOgBrev';
import { useSak } from '~/context/sak/SakContext';
import { SakProps } from '~/types/SakTypes';
import { hentBarnetilleggForRevurdering } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { erDatoIPeriode } from '~/utils/periode';

export type RevurderingInnvilgelseVedtakContext = BegrunnelseOgBrevInput &
    BarnetilleggBegrunnelseInput &
    RevurderingInnvilgelseSkjemaState;

// Separate contexts for å hindre re-renders for komponenter som kun bruker dispatch
const StateContext = createContext({} as RevurderingInnvilgelseVedtakContext);
const DispatchContext = createContext(
    (() => ({})) as Dispatch<RevurderingInnvilgelseSkjemaActions>,
);

const tilValgteTiltaksdeltakelser = (
    behandling: BehandlingData,
    behandlingsperiode: Periode,
): VedtakTiltaksdeltakelsePeriode[] => {
    const overlappendeDeltakelser: VedtakTiltaksdeltakelsePeriode[] = [];

    const tiltak = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).map(
        (tiltaksdeltagelse) => ({
            eksternDeltagelseId: tiltaksdeltagelse.eksternDeltagelseId,
            periode: {
                fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed,
                tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed,
            },
        }),
    );

    // finner tiltaksdeltakelsene som overlapper med innvilgelsesperioden for at det skal bli riktig når man har flere tiltak, men bare et av dem gjelder valgt periode
    tiltak.forEach((tiltaksdeltagelse) => {
        if (
            erDatoIPeriode(behandlingsperiode.fraOgMed, tiltaksdeltagelse.periode) ||
            erDatoIPeriode(behandlingsperiode.tilOgMed, tiltaksdeltagelse.periode)
        ) {
            overlappendeDeltakelser.push(tiltaksdeltagelse);
        }
    });
    return overlappendeDeltakelser;
};

const initieltVedtakSkjema = ({
    behandling,
    sak,
}: {
    behandling: RevurderingData;
    sak: SakProps;
}): RevurderingInnvilgelseSkjemaState => {
    const tiltaksperiode: Periode = hentHeleTiltaksdeltagelsesperioden(behandling);

    const behandlingsperiode = behandling.virkningsperiode ?? tiltaksperiode;

    const barnetilleggPerioder = hentBarnetilleggForRevurdering(
        behandlingsperiode,
        behandling,
        sak,
    );

    return {
        behandlingsperiode,
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder,
        valgteTiltaksdeltakelser:
            behandling.valgteTiltaksdeltakelser ?? tilValgteTiltaksdeltakelser(behandling, behandlingsperiode),
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode ?? [
            {
                antallDagerPerMeldeperiode: 10,
                periode: {
                    fraOgMed: behandlingsperiode.fraOgMed,
                    tilOgMed: behandlingsperiode.tilOgMed,
                },
            },
        ],
    };
};

export const RevurderingInnvilgelseVedtakProvider = ({ children }: PropsWithChildren) => {
    const { behandling } = useRevurderingBehandling();
    const { sak } = useSak();

    const [vedtak, dispatch] = useReducer(
        RevurderingInnvilgelseReducer,
        { behandling, sak },
        initieltVedtakSkjema,
    );

    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const brevtekstRef = useRef<HTMLTextAreaElement>(null);
    const barnetilleggBegrunnelseRef = useRef<HTMLTextAreaElement>(null);

    const getBegrunnelse = useCallback(
        () => getTextAreaRefValue(begrunnelseRef, behandling.begrunnelseVilkårsvurdering),
        [begrunnelseRef, behandling.begrunnelseVilkårsvurdering],
    );
    const getBrevtekst = useCallback(
        () => getTextAreaRefValue(brevtekstRef, behandling.fritekstTilVedtaksbrev),
        [brevtekstRef, behandling.fritekstTilVedtaksbrev],
    );
    const getBarnetilleggBegrunnelse = useCallback(
        () => getTextAreaRefValue(barnetilleggBegrunnelseRef, behandling.barnetillegg?.begrunnelse),
        [barnetilleggBegrunnelseRef, behandling.barnetillegg],
    );

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider
                value={{
                    ...vedtak,
                    textAreas: {
                        begrunnelse: {
                            ref: begrunnelseRef,
                            getValue: getBegrunnelse,
                        },
                        brevtekst: {
                            ref: brevtekstRef,
                            getValue: getBrevtekst,
                        },
                        barnetilleggBegrunnelse: {
                            ref: barnetilleggBegrunnelseRef,
                            getValue: getBarnetilleggBegrunnelse,
                        },
                    },
                }}
            >
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
};

export const useRevurderingInnvilgelseSkjema = () => {
    return useContext(StateContext);
};

export const useRevurderingInnvilgelseSkjemaDispatch = () => {
    return useContext(DispatchContext);
};
