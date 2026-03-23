import { createContext, PropsWithChildren, useContext } from 'react';
import { BenkFilters } from '~/types/Benk';
import { useSearchParams } from 'next/navigation';
import { benkFiltersFraSearchParams } from '~/components/benk/filter/benkFilterUtils';

type ContextType = {
    filters: BenkFilters;
};

const Context = createContext<ContextType>({
    filters: {
        benktype: null,
        type: null,
        status: null,
        saksbehandler: null,
    },
});

export const BenkFiltreringProvider = ({ children }: PropsWithChildren) => {
    const searchParams = useSearchParams();

    return (
        <Context.Provider value={{ filters: benkFiltersFraSearchParams(searchParams) }}>
            {children}
        </Context.Provider>
    );
};

export const useBenkFilter = () => {
    return useContext(Context);
};
