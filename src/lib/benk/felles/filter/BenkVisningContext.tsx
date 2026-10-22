import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { BenkSøknadsbehandling } from '../../typer/søknader';
import { BenkRevurdering } from '../../typer/revurderinger';
import { BenkTilbakekreving } from '../../typer/tilbakekreving';
import { BENK_MINE_TAB } from '../../typer/tabs';
import { BenkTabData } from '../../typer/benkside';
import { BenkGlobaltFilter } from '../../typer/felles';

type BenkVisning = {
    skjulVentestatus: boolean;
    /** De globale filtrene som er aktive nå, slik at de kan beholdes ved navigering til en annen fane */
    globaleFiltre: BenkGlobaltFilter;
    /** Mine-fanen viser bare behandlinger som allerede er tildelt, så der kan man ikke tildele seg flere */
    kanTildeleFlere: boolean;
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
    globaleFiltre: { kunTildeltMeg: false, skjulPåVent: false, skjulEgneTilBeslutning: false },
    kanTildeleFlere: true,
    valgtTildeling: [],
    toggleValgtTildeling: () => {},
});

type Props = PropsWithChildren<{
    tabData: BenkTabData;
}>;

export type BehandlingSomKanBatchTildeles =
    BenkSøknadsbehandling | BenkRevurdering | BenkTilbakekreving;

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

    const { kunTildeltMeg, skjulPåVent, skjulEgneTilBeslutning } = tabData.data.aktivtFilter;

    return (
        <BenkVisningContext.Provider
            value={{
                skjulVentestatus: skjulPåVent,
                globaleFiltre: { kunTildeltMeg, skjulPåVent, skjulEgneTilBeslutning },
                kanTildeleFlere: tabData.tab !== BENK_MINE_TAB,
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
