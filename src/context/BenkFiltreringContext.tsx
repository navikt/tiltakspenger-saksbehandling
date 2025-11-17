import { createContext, useState } from 'react';
import { BenkFilters } from '~/components/benk/BenkSide';

interface BenkFiltreringContextType {
    filters: BenkFilters;
    setFilters: React.Dispatch<React.SetStateAction<BenkFilters>>;
}

export const BenkFiltreringContext = createContext<BenkFiltreringContextType>({
    filters: {
        benktype: 'Alle',
        type: 'Alle',
        status: 'Alle',
        saksbehandler: 'Alle',
    },
    setFilters: (_: React.SetStateAction<BenkFilters>) => {},
});

export const BenkFiltreringProvider = ({ children }: { children: React.ReactNode }) => {
    const [filters, setFilters] = useState<BenkFilters>({
        benktype: 'Alle',
        type: 'Alle',
        status: 'Alle',
        saksbehandler: 'Alle',
    });

    return (
        <BenkFiltreringContext.Provider
            value={{
                filters: filters,
                setFilters: setFilters,
            }}
        >
            {children}
        </BenkFiltreringContext.Provider>
    );
};
