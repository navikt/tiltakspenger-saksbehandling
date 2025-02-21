import { FørstegangsbehandlingData } from '../../../types/BehandlingTypes';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import {
    VedtakAvslagResultat,
    VedtakData,
    VedtakInnvilgetResultat,
} from '../../../types/VedtakTyper';
import { Periode } from '../../../types/Periode';
import { hentTiltaksPeriode } from '../../../utils/tiltak';
import { BehandlingContextState } from '../context/BehandlingContext';

export type FørstegangsbehandlingContextState = {
    vedtak: VedtakData;
    setBegrunnelse: (begrunnelse: string) => void;
    setBrevTekst: (brevTekst: string) => void;
    setResultat: (resultat: VedtakInnvilgetResultat | VedtakAvslagResultat) => void;
    oppdaterInnvilgelsesPeriode: (periode: Partial<Periode>) => void;
} & BehandlingContextState<FørstegangsbehandlingData>;

const FørstegangsbehandlingContext = createContext({} as FørstegangsbehandlingContextState);

export const useFørstegangsbehandling = () => {
    return useContext(FørstegangsbehandlingContext);
};

type ProviderProps = {
    behandlingContext: BehandlingContextState<FørstegangsbehandlingData>;
    children: ReactNode;
};

export const FørstegangsbehandlingProvider = ({ behandlingContext, children }: ProviderProps) => {
    const { behandling } = behandlingContext;

    const initialVedtak: VedtakData = {
        begrunnelseVilkårsvurdering: behandling.begrunnelseVilkårsvurdering ?? '',
        fritekstTilVedtaksbrev: behandling.fritekstTilVedtaksbrev ?? '',
        innvilgelsesPeriode: behandling.virkningsperiode ?? hentTiltaksPeriode(behandling),
        resultat: behandling.virkningsperiode ? 'innvilget' : undefined,
    };

    const [vedtak, setvedtak] = useState<VedtakData>(initialVedtak);

    const setBegrunnelse: FørstegangsbehandlingContextState['setBegrunnelse'] = useCallback(
        (begrunnelse) => {
            setvedtak({ ...vedtak, begrunnelseVilkårsvurdering: begrunnelse });
        },
        [vedtak],
    );

    const setBrevTekst: FørstegangsbehandlingContextState['setBrevTekst'] = useCallback(
        (brevTekst) => {
            setvedtak({ ...vedtak, fritekstTilVedtaksbrev: brevTekst });
        },
        [vedtak],
    );

    const setResultat: FørstegangsbehandlingContextState['setResultat'] = useCallback(
        (resultat) => {
            setvedtak({ ...vedtak, ...resultat });
        },
        [vedtak],
    );

    const oppdaterInnvilgelsesPeriode: FørstegangsbehandlingContextState['oppdaterInnvilgelsesPeriode'] =
        useCallback(
            (periode) => {
                setvedtak({
                    ...vedtak,
                    innvilgelsesPeriode: { ...vedtak.innvilgelsesPeriode, ...periode },
                });
            },
            [vedtak],
        );

    return (
        <FørstegangsbehandlingContext.Provider
            value={{
                ...behandlingContext,
                vedtak,
                setBegrunnelse,
                setBrevTekst,
                setResultat,
                oppdaterInnvilgelsesPeriode,
            }}
        >
            {children}
        </FørstegangsbehandlingContext.Provider>
    );
};
