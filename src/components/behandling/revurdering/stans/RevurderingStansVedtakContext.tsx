import { createContext, PropsWithChildren, useCallback, useContext, useRef, useState } from 'react';
import { useRevurderingBehandling } from '../../BehandlingContext';
import { BegrunnelseOgBrevInput } from '~/components/behandling/felles/state/BegrunnelseOgBrev';
import { getTextAreaRefValue } from '~/utils/textarea';

export type RevurderingStansVedtakContext = {
    valgtHjemmelHarIkkeRettighet: string[];
    setValgtHjemmelHarIkkeRettighet: (valgtHjemmel: string[]) => void;
    stansdato: string;
    setStansdato: (fraOgMed: string) => void;
} & BegrunnelseOgBrevInput;

const Context = createContext({} as RevurderingStansVedtakContext);

export const RevurderingStansVedtakProvider = ({ children }: PropsWithChildren) => {
    const { behandling } = useRevurderingBehandling();

    // Om saksbehandler har valgt en dato, vis denne. Hvis ikke er den tom så saksbehandler må ta stilling til når vedtaket skal stanses.
    const initiellStansdato = behandling.virkningsperiode?.fraOgMed ?? '';
    const [stansdato, setStansdato] = useState(initiellStansdato);
    const [valgtHjemmelHarIkkeRettighet, setValgtHjemmelHarIkkeRettighet] = useState<string[]>(
        behandling.valgtHjemmelHarIkkeRettighet ?? [],
    );
    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const brevtekstRef = useRef<HTMLTextAreaElement>(null);

    const getBegrunnelse = useCallback(
        () => getTextAreaRefValue(begrunnelseRef, behandling.begrunnelseVilkårsvurdering),
        [begrunnelseRef, behandling.begrunnelseVilkårsvurdering],
    );
    const getBrevtekst = useCallback(
        () => getTextAreaRefValue(brevtekstRef, behandling.fritekstTilVedtaksbrev),
        [brevtekstRef, behandling.fritekstTilVedtaksbrev],
    );

    return (
        <Context.Provider
            value={{
                textAreas: {
                    begrunnelse: {
                        ref: begrunnelseRef,
                        getValue: getBegrunnelse,
                    },
                    brevtekst: {
                        ref: brevtekstRef,
                        getValue: getBrevtekst,
                    },
                },
                stansdato,
                setStansdato,
                valgtHjemmelHarIkkeRettighet,
                setValgtHjemmelHarIkkeRettighet,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useRevurderingStansVedtak = () => {
    return useContext(Context);
};
