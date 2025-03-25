import {
    createContext,
    PropsWithChildren,
    RefObject,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';
import { useBehandling } from '../BehandlingContext';
import { dateTilISOTekst } from '../../../utils/date';

export type RevurderingVedtakContext = {
    begrunnelseRef: RefObject<HTMLTextAreaElement>;
    brevtekstRef: RefObject<HTMLTextAreaElement>;
    getBegrunnelse: () => string;
    getBrevtekst: () => string;
    valgtHjemmel: string[];
    setValgtHjemmel: (valgtHjemmel: string[]) => void;
    stansdato: string;
    setStansdato: (fraOgMed: string) => void;
};

const Context = createContext({} as RevurderingVedtakContext);

export const RevurderingVedtakProvider = ({ children }: PropsWithChildren) => {
    const { behandling } = useBehandling();

    const initiellStansdato = behandling.virkningsperiode?.fraOgMed ?? new Date().toISOString();
    const [stansdato, setStansdato] = useState(dateTilISOTekst(initiellStansdato));
    const [valgtHjemmel, setValgtHjemmel] = useState<string[]>([]);

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
                valgtHjemmel,
                setValgtHjemmel,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useRevurderingVedtak = () => {
    return useContext(Context);
};
