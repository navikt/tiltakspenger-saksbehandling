import { createContext, PropsWithChildren, useCallback, useContext, useRef, useState } from 'react';
import { useRevurderingBehandling } from '../../BehandlingContext';
import { TextAreaInput } from '~/utils/textarea';

export type RevurderingStansVedtakContext = {
    textAreas: {
        begrunnelse: TextAreaInput;
        brevtekst: TextAreaInput;
    };
    valgtHjemmelHarIkkeRettighet: string[];
    setValgtHjemmelHarIkkeRettighet: (valgtHjemmel: string[]) => void;
    stansdato: string;
    setStansdato: (fraOgMed: string) => void;
};

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

    const getBegrunnelse = useCallback(() => begrunnelseRef.current!.value, [begrunnelseRef]);
    const getBrevtekst = useCallback(
        () => brevtekstRef.current?.value.trim() ?? '',
        [brevtekstRef],
    );

    return (
        <Context.Provider
            value={{
                textAreas: {
                    begrunnelse: {
                        ref: begrunnelseRef,
                        get: getBegrunnelse,
                    },
                    brevtekst: {
                        ref: brevtekstRef,
                        get: getBrevtekst,
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
