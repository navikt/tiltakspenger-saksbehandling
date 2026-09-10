import { createContext, PropsWithChildren, useContext, useState } from 'react';

type BenkVisning = {
    skjulVentestatus: boolean;
    valgtTildeling: TildelingType | null;
    setValgtTildeling: (tildelingType: TildelingType) => void;
};

type TildelingType = 'saksbehandler' | 'beslutter';

const BenkVisningContext = createContext<BenkVisning>({
    setValgtTildeling: () => {},
    valgtTildeling: null,
    skjulVentestatus: false,
});

type Props = PropsWithChildren<{
    skjulVentestatus: boolean;
}>;

/**
 * Visningsvalg fra det aktive filteret som gjelder alle fanenes tabeller.
 * Lar delte kolonner (Ventestatus) skjules uten prop-drilling gjennom hver tabell,
 * og sørger for at kolonneoverskrift og celler alltid er i sync.
 */
export const BenkVisningProvider = ({ skjulVentestatus, children }: Props) => {
    const [valgtTildeling, setValgtTildeling] = useState<TildelingType | null>(null);
    return (
        <BenkVisningContext.Provider
            value={{ skjulVentestatus, valgtTildeling, setValgtTildeling }}
        >
            {children}
        </BenkVisningContext.Provider>
    );
};

export const useBenkVisning = () => useContext(BenkVisningContext);
