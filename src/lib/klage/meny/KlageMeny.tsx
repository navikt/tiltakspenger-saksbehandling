import React from 'react';
import { nonNullish } from '~/utils/object';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronDownIcon,
    PauseIcon,
    PersonIcon,
    PlayIcon,
} from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import router from 'next/router';
import { Klagebehandling, SaksbehandlerKlagebehandlingKommando } from '~/lib/klage/typer/Klage';
import { finnSisteGyldigeStegForKlage } from '~/lib/klage/utils/klageUtils';
import AvsluttBehandlingMenyvalg from '../../personoversikt/avsluttBehandling/AvsluttBehandlingMenyvalg';
import { useSak } from '~/lib/sak/SakContext';
import {
    useGjenopptaKlagebehandling,
    useLeggKlagebehandlingTilbake,
    useOvertaKlagebehandling,
    useSettKlagebehandlingPåVent,
    useTaKlagebehandling,
} from '~/lib/klage/api/KlageApi';
import OvertaKlagebehandlingModal from '../modaler/overta/OvertaKlagebehandlingModal';
import SettKlagebehandlingPåVentModal from '~/lib/klage/modaler/sett-på-vent/SettKlagebehandlingPåVentModal';
import { Nullable } from '~/types/UtilTypes';
import { KlageApiErrorFeilModal, ApiErrorState } from '~/lib/klage/modaler/KlageApiErrorFeilModal';
import AvbrytKlagebehandlingModal from '~/lib/klage/modaler/avbryt/AvbrytKlagebehandlingModal';

const KlageMeny = (props: { klage: Klagebehandling }) => {
    const { setSak } = useSak();
    const [visVilOvertaModal, setVisVilOvertaModal] = React.useState(false);
    const [visAvsluttBehandlingModal, setVisAvsluttBehandlingModal] = React.useState(false);
    const [ventemodus, setVentemodus] = React.useState<Nullable<Ventemodus>>(null);
    const [apiError, setApiError] = React.useState<ApiErrorState>({
        visFeilModal: false,
        feil: null,
    });

    const kan = (kommando: SaksbehandlerKlagebehandlingKommando) =>
        props.klage.gyldigeKommandoer.includes(kommando);

    const taKlagebehandling = useTaKlagebehandling({
        sakId: props.klage.sakId,
        klageId: props.klage.id,
        onSuccess: (sak) => {
            setSak(sak);
            router.push(finnSisteGyldigeStegForKlage(props.klage));
        },
    });

    const overtaKlagebehandling = useOvertaKlagebehandling({
        sakId: props.klage.sakId,
        klageId: props.klage.id,
        onSuccess: (sak) => {
            setSak(sak);
            router.push(finnSisteGyldigeStegForKlage(props.klage));
        },
    });

    const leggTilbake = useLeggKlagebehandlingTilbake({
        sakId: props.klage.sakId,
        klageId: props.klage.id,
        onSuccess: (sak) => setSak(sak),
        onError: (error) => setApiError({ visFeilModal: true, feil: error }),
    });

    const settPåVent = useSettKlagebehandlingPåVent({
        sakId: props.klage.sakId,
        klageId: props.klage.id,
        onSuccess: (sak) => {
            setSak(sak);
            setVentemodus(null);
        },
    });

    const åpneVentemodal = (modus: Ventemodus) => {
        settPåVent.reset();
        setVentemodus(modus);
    };

    const gjenoppta = useGjenopptaKlagebehandling({
        sakId: props.klage.sakId,
        klageId: props.klage.id,
        onSuccess: (sak) => {
            setSak(sak);
            router.push(finnSisteGyldigeStegForKlage(props.klage));
        },
        onError: (error) => setApiError({ visFeilModal: true, feil: error }),
    });

    const harMenyvalg = props.klage.gyldigeKommandoer.some(
        (kommando) => kommando !== SaksbehandlerKlagebehandlingKommando.Saksbehandle,
    );

    if (!harMenyvalg) {
        return null;
    }

    return (
        <>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        variant="secondary"
                        iconPosition="right"
                        icon={<ChevronDownIcon title="Menyvalg" />}
                        size="small"
                    >
                        Velg
                    </Button>
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    {kan(SaksbehandlerKlagebehandlingKommando.Tildel) && (
                        <ActionMenu.Item
                            onClick={() => {
                                taKlagebehandling.trigger();
                            }}
                            icon={<PersonIcon aria-hidden />}
                        >
                            Tildel meg
                        </ActionMenu.Item>
                    )}

                    {kan(SaksbehandlerKlagebehandlingKommando.Overta) && (
                        <ActionMenu.Item
                            icon={<ArrowRightIcon aria-hidden />}
                            onClick={() => {
                                setVisVilOvertaModal(true);
                            }}
                        >
                            Overta behandling
                        </ActionMenu.Item>
                    )}

                    {kan(SaksbehandlerKlagebehandlingKommando.Gjenoppta) && (
                        <ActionMenu.Item
                            icon={<PlayIcon aria-hidden />}
                            onClick={() => {
                                gjenoppta.trigger();
                            }}
                        >
                            Gjenoppta
                        </ActionMenu.Item>
                    )}

                    {kan(SaksbehandlerKlagebehandlingKommando.OppdatereSettPåVent) && (
                        <ActionMenu.Item
                            icon={<PauseIcon aria-hidden />}
                            onClick={() => {
                                åpneVentemodal('endreVentestatus');
                            }}
                        >
                            Endre ventestatus
                        </ActionMenu.Item>
                    )}

                    {kan(SaksbehandlerKlagebehandlingKommando.LeggTilbake) && (
                        <ActionMenu.Item
                            icon={<ArrowLeftIcon aria-hidden />}
                            onClick={() => {
                                leggTilbake.trigger();
                            }}
                        >
                            Legg tilbake
                        </ActionMenu.Item>
                    )}

                    {kan(SaksbehandlerKlagebehandlingKommando.SettPåVent) && (
                        <ActionMenu.Item
                            icon={<PauseIcon aria-hidden />}
                            onClick={() => {
                                åpneVentemodal('settPåVent');
                            }}
                        >
                            Sett på vent
                        </ActionMenu.Item>
                    )}

                    {kan(SaksbehandlerKlagebehandlingKommando.Avbryt) && (
                        <>
                            <ActionMenu.Divider />
                            <AvsluttBehandlingMenyvalg
                                setVisAvsluttBehandlingModal={setVisAvsluttBehandlingModal}
                            />
                        </>
                    )}
                </ActionMenu.Content>
            </ActionMenu>
            {visAvsluttBehandlingModal && (
                <AvbrytKlagebehandlingModal
                    sakId={props.klage.sakId}
                    klageId={props.klage.id}
                    saksnummer={props.klage.saksnummer}
                    åpen={visAvsluttBehandlingModal}
                    onClose={() => setVisAvsluttBehandlingModal(false)}
                />
            )}
            {visVilOvertaModal && (
                <OvertaKlagebehandlingModal
                    åpen={visVilOvertaModal}
                    onClose={() => setVisVilOvertaModal(false)}
                    //knappen for å overta rendres kun dersom saksbehandler finnes
                    overtarFra={nonNullish(props.klage.saksbehandler)}
                    api={{
                        trigger: overtaKlagebehandling.trigger,
                        isMutating: overtaKlagebehandling.isMutating,
                        error: overtaKlagebehandling.error ?? null,
                    }}
                />
            )}
            {ventemodus && (
                <SettKlagebehandlingPåVentModal
                    åpen={true}
                    onClose={() => setVentemodus(null)}
                    oppdaterSattPåVent={ventemodus === 'endreVentestatus'}
                    api={{
                        trigger: (begrunnelse, frist) =>
                            settPåVent.trigger({
                                begrunnelse,
                                frist,
                                oppdaterSattPåVent: ventemodus === 'endreVentestatus',
                            }),
                        isMutating: settPåVent.isMutating,
                        error: settPåVent.error ?? null,
                    }}
                />
            )}
            {apiError.visFeilModal && (
                <KlageApiErrorFeilModal
                    åpen={apiError.visFeilModal}
                    onClose={() => setApiError({ visFeilModal: false, feil: null })}
                    error={nonNullish(apiError.feil)}
                />
            )}
        </>
    );
};

export default KlageMeny;

type Ventemodus = 'settPåVent' | 'endreVentestatus';
