import { createContext, ReactNode, useContext } from 'react';

type BenkVisning = {
    skjulVentestatus: boolean;
};

const BenkVisningContext = createContext<BenkVisning>({ skjulVentestatus: false });

/**
 * Visningsvalg fra det aktive filteret som gjelder alle fanenes tabeller.
 * Lar delte kolonner (Ventestatus) skjules uten prop-drilling gjennom hver tabell,
 * og sørger for at kolonneoverskrift og celler alltid er i sync.
 */
export const BenkVisningProvider = ({
    skjulVentestatus,
    children,
}: BenkVisning & { children: ReactNode }) => (
    <BenkVisningContext.Provider value={{ skjulVentestatus }}>
        {children}
    </BenkVisningContext.Provider>
);

export const useBenkVisning = () => useContext(BenkVisningContext);
