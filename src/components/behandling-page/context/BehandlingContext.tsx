import {
    BehandlingData,
    Behandlingstype,
    FørstegangsbehandlingData,
} from '../../../types/BehandlingTypes';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import {
    VedtakAvslagResultat,
    VedtakData,
    VedtakInnvilgetResultat,
} from '../../../types/VedtakTyper';
import { Periode } from '../../../types/Periode';
import { kanBeslutteForBehandling, kanSaksbehandleForBehandling } from '../../../utils/tilganger';
import { useSaksbehandler } from '../../../hooks/useSaksbehandler';
import { SaksbehandlerRolle } from '../../../types/Saksbehandler';
import { hentTiltaksPeriode } from '../../../utils/vilkår';

export type BehandlingContextState = {
    behandling: BehandlingData;
    setBehandling: (behandling: BehandlingData) => void;
    vedtak: VedtakData;
    rolleForBehandling: SaksbehandlerRolle.SAKSBEHANDLER | SaksbehandlerRolle.BESLUTTER | null;
    setBegrunnelse: (begrunnelse: string) => void;
    setBrevTekst: (brevTekst: string) => void;
    setResultat: (resultat: VedtakInnvilgetResultat | VedtakAvslagResultat) => void;
    oppdaterInnvilgelsesPeriode: (periode: Partial<Periode>) => void;
};

const BehandlingContext = createContext({} as BehandlingContextState);

type ProviderProps = {
    behandling: BehandlingData;
    children: ReactNode;
};

export const BehandlingProvider = ({ behandling: initialBehandling, children }: ProviderProps) => {
    const [behandling, setBehandling] = useState<BehandlingData>(initialBehandling);

    // TODO: vedtak bør ha sin egen provider, og må separares for førstegangsbehandling og revurdering
    const initialVedtak: VedtakData = {
        begrunnelseVilkårsvurdering: behandling.begrunnelseVilkårsvurdering ?? '',
        fritekstTilVedtaksbrev:
            (behandling as FørstegangsbehandlingData).fritekstTilVedtaksbrev ?? '',
        innvilgelsesPeriode:
            behandling.virkningsperiode ??
            (behandling.type === Behandlingstype.FØRSTEGANGSBEHANDLING
                ? hentTiltaksPeriode(behandling)
                : { fraOgMed: new Date().toISOString(), tilOgMed: new Date().toISOString() }),
        resultat: behandling.virkningsperiode ? 'innvilget' : undefined,
    };

    const [vedtak, setvedtak] = useState<VedtakData>(initialVedtak);

    const { innloggetSaksbehandler } = useSaksbehandler();
    const rolleForBehandling = kanSaksbehandleForBehandling(behandling, innloggetSaksbehandler)
        ? SaksbehandlerRolle.SAKSBEHANDLER
        : kanBeslutteForBehandling(behandling, innloggetSaksbehandler)
          ? SaksbehandlerRolle.BESLUTTER
          : null;

    const setBegrunnelse: BehandlingContextState['setBegrunnelse'] = useCallback(
        (begrunnelse) => {
            setvedtak({ ...vedtak, begrunnelseVilkårsvurdering: begrunnelse });
        },
        [vedtak],
    );

    const setBrevTekst: BehandlingContextState['setBrevTekst'] = useCallback(
        (brevTekst) => {
            setvedtak({ ...vedtak, fritekstTilVedtaksbrev: brevTekst });
        },
        [vedtak],
    );

    const setResultat: BehandlingContextState['setResultat'] = useCallback(
        (resultat) => {
            setvedtak({ ...vedtak, ...resultat });
        },
        [vedtak],
    );

    const oppdaterInnvilgelsesPeriode: BehandlingContextState['oppdaterInnvilgelsesPeriode'] =
        useCallback(
            (periode) => {
                setvedtak({
                    ...vedtak,
                    innvilgelsesPeriode: { ...vedtak.innvilgelsesPeriode, ...periode },
                });
            },
            [vedtak],
        );

    return (
        <BehandlingContext.Provider
            value={{
                behandling,
                setBehandling,
                vedtak,
                rolleForBehandling,
                setBegrunnelse,
                setBrevTekst,
                setResultat,
                oppdaterInnvilgelsesPeriode,
            }}
        >
            {children}
        </BehandlingContext.Provider>
    );
};

export const useBehandling = () => {
    return useContext(BehandlingContext);
};
