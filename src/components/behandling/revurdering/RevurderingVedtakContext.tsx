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

export type RevurderingVedtakContext = {
    begrunnelseRef: RefObject<HTMLTextAreaElement>;
    getBegrunnelse: () => string;
    stansdato: string;
    setStansdato: (fraOgMed: string) => void;
};

const Context = createContext({} as RevurderingVedtakContext);

export const RevurderingVedtakProvider = ({ children }: PropsWithChildren) => {
    const { behandling } = useBehandling();

    const initiellStansdato = behandling.virkningsperiode?.fraOgMed ?? new Date().toISOString();
    const [stansdato, setStansdato] = useState(initiellStansdato);

    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const getBegrunnelse = useCallback(() => begrunnelseRef.current!.value, [begrunnelseRef]);

    return (
        <Context.Provider
            value={{
                stansdato,
                setStansdato,
                begrunnelseRef,
                getBegrunnelse,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useRevurderingVedtak = () => {
    return useContext(Context);
};
