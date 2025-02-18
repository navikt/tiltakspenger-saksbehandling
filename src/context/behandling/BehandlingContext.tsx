import { BehandlingData } from '../../types/BehandlingTypes';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { VedtakAvslagResultat, VedtakData, VedtakInnvilgetResultat } from '../../types/VedtakTyper';
import { hentTiltaksPeriode } from '../../utils/vilkår';
import { Periode } from '../../types/Periode';

export type BehandlingContextState = {
    behandling: BehandlingData;
    vedtakUnderBehandling: VedtakData;
    setBegrunnelse: (begrunnelse: string) => void;
    setBrevTekst: (brevTekst: string) => void;
    setResultat: (resultat: VedtakInnvilgetResultat | VedtakAvslagResultat) => void;
    oppdaterInnvilgelsesPeriode: (periode: Partial<Periode>) => void;
};

const BehandlingContext = createContext({} as BehandlingContextState);

type ProviderProps = {
    behandling: BehandlingData;
    children: ReactNode;
};

export const BehandlingProvider = ({ behandling, children }: ProviderProps) => {
    const defaultVedtak: VedtakData = {
        begrunnelseVilkårsvurdering: behandling.begrunnelseVilkårsvurdering ?? '',
        fritekstTilVedtaksbrev: behandling.fritekstTilVedtaksbrev ?? '',
        innvilgelsesPeriode: hentTiltaksPeriode(behandling),
        resultat: undefined,
    };

    const [vedtak, setvedtak] = useState<VedtakData>(defaultVedtak);

    const setBegrunnelse: BehandlingContextState['setBegrunnelse'] = useCallback(
        (begrunnelse) => {
            setvedtak({ ...vedtak, begrunnelseVilkårsvurdering: begrunnelse });
        },
        [vedtak],
    );

    const setBrevTekst: BehandlingContextState['setBrevTekst'] = useCallback(
        (brevTekst) => {
            setvedtak({ ...vedtak, fritekstTilVedtaksbrev: brevTekst });
        },
        [vedtak],
    );

    const setResultat: BehandlingContextState['setResultat'] = useCallback(
        (resultat) => {
            setvedtak({ ...vedtak, ...resultat });
        },
        [vedtak],
    );

    const oppdaterInnvilgetPeriode: BehandlingContextState['oppdaterInnvilgelsesPeriode'] =
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
        <BehandlingContext.Provider
            value={{
                behandling,
                vedtakUnderBehandling: vedtak,
                setBegrunnelse,
                setBrevTekst,
                setResultat,
                oppdaterInnvilgelsesPeriode: oppdaterInnvilgetPeriode,
            }}
        >
            {children}
        </BehandlingContext.Provider>
    );
};

export const useBehandling = () => {
    return useContext(BehandlingContext);
};
