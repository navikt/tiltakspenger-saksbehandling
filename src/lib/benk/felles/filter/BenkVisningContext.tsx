import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { BenkSøknadsbehandling } from '~/lib/benk/typer/søknader';
import { BenkRevurdering } from '~/lib/benk/typer/revurderinger';

type BenkVisning = {
    skjulVentestatus: boolean;
    valgtTildelingType: TildelingType | null;
    setValgtTildelingType: (tildelingType: TildelingType | null) => void;
    valgtTildeling: Array<BehandlingSomKanBatchTildeles>;
    toggleValgtTildeling: (
        valgtBehandling: BehandlingSomKanBatchTildeles,
        erValgt: boolean,
    ) => void;
};

type TildelingType = 'saksbehandler' | 'beslutter';

const BenkVisningContext = createContext<BenkVisning>({
    setValgtTildelingType: () => {},
    valgtTildelingType: null,
    skjulVentestatus: false,
    valgtTildeling: [],
    toggleValgtTildeling: () => {},
});

type Props = PropsWithChildren<{
    skjulVentestatus: boolean;
}>;

type BehandlingSomKanBatchTildeles = BenkSøknadsbehandling | BenkRevurdering;

/**
 * Visningsvalg fra det aktive filteret som gjelder alle fanenes tabeller.
 * Lar delte kolonner (Ventestatus) skjules uten prop-drilling gjennom hver tabell,
 * og sørger for at kolonneoverskrift og celler alltid er i sync.
 */
export const BenkVisningProvider = ({ skjulVentestatus, children }: Props) => {
    const [valgtTildelingType, setValgtTildelingType] = useState<TildelingType | null>(null);
    const [valgtTildeling, setValgtTildeling] = useState<
        ReadonlySet<BehandlingSomKanBatchTildeles>
    >(new Set());

    const toggleValgtTildeling = (
        valgtBehandling: BehandlingSomKanBatchTildeles,
        erValgt: boolean,
    ) => {
        if (!erValgt) {
            setValgtTildeling(
                new Set([...valgtTildeling].filter((b) => b.id !== valgtBehandling.id)),
            );
        } else {
            setValgtTildeling(new Set([...valgtTildeling, valgtBehandling]));
        }
    };

    return (
        <BenkVisningContext.Provider
            value={{
                skjulVentestatus,
                valgtTildelingType: valgtTildelingType,
                setValgtTildelingType: setValgtTildelingType,
                valgtTildeling: [...valgtTildeling],
                toggleValgtTildeling: toggleValgtTildeling,
            }}
        >
            {children}
        </BenkVisningContext.Provider>
    );
};

export const useBenkVisning = () => useContext(BenkVisningContext);
