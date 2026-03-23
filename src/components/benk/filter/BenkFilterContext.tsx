import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { BenkFilters } from '~/types/Benk';
import { useSearchParams } from 'next/navigation';
import { benkFiltersFraSearchParams } from '~/components/benk/filter/benkFilterUtils';

type ContextType = {
    filters: BenkFilters;
    setFilters: (filters: BenkFilters) => void;
};

const Context = createContext<ContextType>({
    filters: {
        benktype: null,
        type: null,
        status: null,
        saksbehandler: null,
    },
    setFilters: () => {},
});

export const BenkFiltreringProvider = ({ children }: PropsWithChildren) => {
    const searchParams = useSearchParams();
    const initialFilters = benkFiltersFraSearchParams(searchParams);

    const [filters, setFilters] = useState<BenkFilters>(initialFilters);

    return <Context.Provider value={{ filters, setFilters }}>{children}</Context.Provider>;
};

export const useBenkFilter = () => {
    return useContext(Context);
};
