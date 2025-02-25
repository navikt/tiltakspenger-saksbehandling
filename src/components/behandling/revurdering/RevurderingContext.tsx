import { RevurderingData } from '../../../types/BehandlingTypes';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { RevurderTilStansVedtak } from '../../../types/VedtakTyper';
import { BehandlingContextState } from '../context/BehandlingContext';

export type RevurderingContextState = {
    vedtak: RevurderTilStansVedtak;
    setBegrunnelse: (begrunnelse: string) => void;
    setStansDato: (fraOgMed: string) => void;
} & BehandlingContextState<RevurderingData>;

const RevurderingContext = createContext({} as RevurderingContextState);

export const useRevurdering = () => {
    return useContext(RevurderingContext);
};

type ProviderProps = {
    behandlingContext: BehandlingContextState<RevurderingData>;
    children: ReactNode;
};

export const RevurderingProvider = ({ behandlingContext, children }: ProviderProps) => {
    const { behandling } = behandlingContext;

    const initialVedtak: RevurderTilStansVedtak = {
        begrunnelse: behandling.begrunnelseVilkårsvurdering ?? '',
        stansDato: behandling.virkningsperiode?.fraOgMed ?? new Date().toISOString(),
    };

    const [vedtak, setVedtak] = useState<RevurderTilStansVedtak>(initialVedtak);

    const setBegrunnelse: RevurderingContextState['setBegrunnelse'] = useCallback(
        (begrunnelse) => {
            setVedtak({ ...vedtak, begrunnelse });
        },
        [vedtak],
    );

    const setStansDato: RevurderingContextState['setStansDato'] = useCallback(
        (stansDato) => {
            setVedtak({ ...vedtak, stansDato });
        },
        [vedtak],
    );

    return (
        <RevurderingContext.Provider
            value={{
                ...behandlingContext,
                vedtak,
                setBegrunnelse,
                setStansDato,
            }}
        >
            {children}
        </RevurderingContext.Provider>
    );
};
