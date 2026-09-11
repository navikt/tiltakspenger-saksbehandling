import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

type BenkVisning = {
    skjulVentestatus: boolean;
    valgtTildelingType: TildelingType | null;
    setValgtTildelingType: (tildelingType: TildelingType | null) => void;
    valgtTildeling: ReadonlySet<RammebehandlingId>;
    toggleValgtTildeling: (rammebehandlingId: RammebehandlingId, erValgt: boolean) => void;
};

type TildelingType = 'saksbehandler' | 'beslutter';

const BenkVisningContext = createContext<BenkVisning>({
    setValgtTildelingType: () => {},
    valgtTildelingType: null,
    skjulVentestatus: false,
    valgtTildeling: new Set<RammebehandlingId>(),
    toggleValgtTildeling: () => {},
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
    const [valgtTildelingType, setValgtTildelingType] = useState<TildelingType | null>(null);
    const [valgtTildeling, setValgtTildeling] = useState<ReadonlySet<RammebehandlingId>>(new Set());

    const toggleValgtTildeling = (rammebehandlingId: RammebehandlingId, erValgt: boolean) => {
        //TODO - Ta inn sakID
        if (!erValgt) {
            setValgtTildeling(
                new Set([...valgtTildeling].filter((id) => id !== rammebehandlingId)),
            );
        } else {
            setValgtTildeling(new Set([...valgtTildeling, rammebehandlingId]));
        }
    };

    return (
        <BenkVisningContext.Provider
            value={{
                skjulVentestatus,
                valgtTildelingType: valgtTildelingType,
                setValgtTildelingType: setValgtTildelingType,
                valgtTildeling: valgtTildeling,
                toggleValgtTildeling: toggleValgtTildeling,
            }}
        >
            {children}
        </BenkVisningContext.Provider>
    );
};

export const useBenkVisning = () => useContext(BenkVisningContext);
