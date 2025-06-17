import {
    createContext,
    PropsWithChildren,
    RefObject,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';
import { useRevurderingBehandling } from '../BehandlingContext';

export type RevurderingVedtakContext = {
    begrunnelseRef: RefObject<HTMLTextAreaElement>;
    brevtekstRef: RefObject<HTMLTextAreaElement>;
    getBegrunnelse: () => string;
    getBrevtekst: () => string;
    valgtHjemmelHarIkkeRettighet: string[];
    setValgtHjemmelHarIkkeRettighet: (valgtHjemmel: string[]) => void;
    stansdato: string;
    setStansdato: (fraOgMed: string) => void;
};

const Context = createContext({} as RevurderingVedtakContext);

export const RevurderingVedtakProvider = ({ children }: PropsWithChildren) => {
    const { behandling } = useRevurderingBehandling();

    // Om saksbehandler har valgt en dato, vis denne. Hvis ikke er den tom så saksbehandler må ta stilling til når vedtaket skal stanses.
    const initiellStansdato = behandling.virkningsperiode?.fraOgMed ?? '';
    const [stansdato, setStansdato] = useState(initiellStansdato);
    const [valgtHjemmelHarIkkeRettighet, setValgtHjemmelHarIkkeRettighet] = useState<string[]>(
        behandling.valgtHjemmelHarIkkeRettighet ?? [],
    );
    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const brevtekstRef = useRef<HTMLTextAreaElement>(null);

    const getBrevtekst = useCallback(
        () => brevtekstRef.current?.value.trim() ?? '',
        [brevtekstRef],
    );
    const getBegrunnelse = useCallback(() => begrunnelseRef.current!.value, [begrunnelseRef]);

    return (
        <Context.Provider
            value={{
                stansdato,
                setStansdato,
                begrunnelseRef,
                getBegrunnelse,
                brevtekstRef,
                getBrevtekst,
                valgtHjemmelHarIkkeRettighet,
                setValgtHjemmelHarIkkeRettighet,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useRevurderingVedtak = () => {
    return useContext(Context);
};
