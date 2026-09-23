import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { BenkSøknadsbehandling } from '../../typer/søknader';
import { BenkRevurdering } from '../../typer/revurderinger';
import { BenkTab } from '../../typer/tabs';
import { BenkTabData } from '../../typer/benkside';

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
    tabData: BenkTabData;
}>;

export type BehandlingSomKanBatchTildeles = BenkSøknadsbehandling | BenkRevurdering;

export type BenkTabsMedBatchTildeling = BenkTab.SØKNADER | BenkTab.REVURDERINGER;

/**
 * Visningsvalg fra det aktive filteret som gjelder alle fanenes tabeller.
 * Lar delte kolonner (Ventestatus) skjules uten prop-drilling gjennom hver tabell,
 * og sørger for at kolonneoverskrift og celler alltid er i sync.
 */
export const BenkVisningProvider = ({ tabData, children }: Props) => {
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

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValgtTildeling(new Set());
    }, [valgtTildelingType]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValgtTildelingType(null);
    }, [tabData]);

    return (
        <BenkVisningContext.Provider
            value={{
                skjulVentestatus: tabData.data.aktivtFilter.skjulPåVent,
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
