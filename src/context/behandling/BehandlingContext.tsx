import { BehandlingData } from '../../types/BehandlingTypes';
import { createContext, ReactNode, useContext, useState } from 'react';
import { VedtakAvslagResultat, VedtakData, VedtakInnvilgetResultat } from '../../types/VedtakTyper';

export type BehandlingContextState = {
    behandling: BehandlingData;
    vedtak: VedtakData;
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
        resultat: undefined,
    };

    const [vedtak, setVedtak] = useState<VedtakData>(defaultVedtak);

    const setBegrunnelse = (begrunnelse: string) => {
        setVedtak({ ...vedtak, begrunnelseVilkårsvurdering: begrunnelse });
    };

    const setResultat = (resultat: VedtakInnvilgetResultat | VedtakAvslagResultat) => {
        setVedtak({ ...vedtak, ...resultat });
    };

    return (
        <BehandlingContext.Provider value={{ behandling, vedtak }}>
            {children}
        </BehandlingContext.Provider>
    );
};

export const useBehandling = () => {
    return useContext(BehandlingContext);
};
