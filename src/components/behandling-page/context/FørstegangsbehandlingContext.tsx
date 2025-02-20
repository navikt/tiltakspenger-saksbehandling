import { Behandlingstype, FørstegangsbehandlingData } from '../../../types/BehandlingTypes';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import {
    VedtakAvslagResultat,
    VedtakData,
    VedtakInnvilgetResultat,
} from '../../../types/VedtakTyper';
import { Periode } from '../../../types/Periode';
import { hentTiltaksPeriode } from '../../../utils/vilkår';
import { useBehandling } from './BehandlingContext';

export type FørstegangsbehandlingContextState = {
    behandling: FørstegangsbehandlingData;
    vedtak: VedtakData;
    setBegrunnelse: (begrunnelse: string) => void;
    setBrevTekst: (brevTekst: string) => void;
    setResultat: (resultat: VedtakInnvilgetResultat | VedtakAvslagResultat) => void;
    oppdaterInnvilgelsesPeriode: (periode: Partial<Periode>) => void;
};

const BehandlingContext = createContext({} as FørstegangsbehandlingContextState);

type ProviderProps = {
    children: ReactNode;
};

export const FørstegangsbehandlingProvider = ({ children }: ProviderProps) => {
    // const { behandling } = useBehandling();
    //
    // const initialVedtak: VedtakData = {
    //     begrunnelseVilkårsvurdering: behandling.begrunnelseVilkårsvurdering ?? '',
    //     fritekstTilVedtaksbrev: behandling.fritekstTilVedtaksbrev ?? '',
    //     innvilgelsesPeriode:
    //         behandling.virkningsperiode ??
    //         (behandling.type === Behandlingstype.FØRSTEGANGSBEHANDLING
    //             ? hentTiltaksPeriode(behandling)
    //             : { fraOgMed: new Date().toISOString(), tilOgMed: new Date().toISOString() }),
    //     resultat: behandling.virkningsperiode ? 'innvilget' : undefined,
    // };
    //
    // const [vedtak, setvedtak] = useState<VedtakData>(initialVedtak);
    //
    // const setBegrunnelse: FørstegangsbehandlingContextState['setBegrunnelse'] = useCallback(
    //     (begrunnelse) => {
    //         setvedtak({ ...vedtak, begrunnelseVilkårsvurdering: begrunnelse });
    //     },
    //     [vedtak],
    // );
    //
    // const setBrevTekst: FørstegangsbehandlingContextState['setBrevTekst'] = useCallback(
    //     (brevTekst) => {
    //         setvedtak({ ...vedtak, fritekstTilVedtaksbrev: brevTekst });
    //     },
    //     [vedtak],
    // );
    //
    // const setResultat: FørstegangsbehandlingContextState['setResultat'] = useCallback(
    //     (resultat) => {
    //         setvedtak({ ...vedtak, ...resultat });
    //     },
    //     [vedtak],
    // );
    //
    // const oppdaterInnvilgelsesPeriode: FørstegangsbehandlingContextState['oppdaterInnvilgelsesPeriode'] =
    //     useCallback(
    //         (periode) => {
    //             setvedtak({
    //                 ...vedtak,
    //                 innvilgelsesPeriode: { ...vedtak.innvilgelsesPeriode, ...periode },
    //             });
    //         },
    //         [vedtak],
    //     );
    //
    // if (behandling.type)
    //     return (
    //         <BehandlingContext.Provider
    //             value={{
    //                 behandling,
    //                 vedtak,
    //                 setBegrunnelse,
    //                 setBrevTekst,
    //                 setResultat,
    //                 oppdaterInnvilgelsesPeriode,
    //             }}
    //         >
    //             {children}
    //         </BehandlingContext.Provider>
    //     );
};

export const useFørstegangsbehandling = () => {
    return useContext(BehandlingContext);
};
