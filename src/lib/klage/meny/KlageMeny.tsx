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
import { Klagebehandling } from '~/lib/klage/typer/Klage';
import {
    finnSisteGyldigeStegForKlage,
    kanBehandleKlage,
    kanVidereBehandleKlage,
} from '~/lib/klage/utils/klageUtils';
import AvsluttBehandlingMenyvalg from '../../personoversikt/avsluttBehandling/AvsluttBehandlingMenyvalg';
import { useSak } from '~/lib/sak/SakContext';
import {
    useGjenopptaKlagebehandling,
    useLeggKlagebehandlingTilbake,
    useOvertaKlagebehandling,
    useSettKlagebehandlingPåVent,
    useTaKlagebehandling,
} from '~/lib/klage/api/KlageApi';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import OvertaKlagebehandlingModal from '../modaler/overta/OvertaKlagebehandlingModal';
import SettKlagebehandlingPåVentModal from '~/lib/klage/modaler/sett-på-vent/SettKlagebehandlingPåVentModal';
import { Nullable } from '~/types/UtilTypes';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { KlageApiErrorFeilModal, ApiErrorState } from '~/lib/klage/modaler/KlageApiErrorFeilModal';
import AvbrytKlagebehandlingModal from '~/lib/klage/modaler/avbryt/AvbrytKlagebehandlingModal';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';

import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';

const KlageMeny = (props: {
    klage: Klagebehandling;
    omgjøringsbehandling: Nullable<Rammebehandling | MeldekortbehandlingProps>;
}) => {
    const { setSak } = useSak();
    const { innloggetSaksbehandler, erSaksbehandler } = useSaksbehandler();
    const [visVilOvertaModal, setVisVilOvertaModal] = React.useState(false);
    const [visAvsluttBehandlingModal, setVisAvsluttBehandlingModal] = React.useState(false);
    const [ventemodus, setVentemodus] = React.useState<Nullable<Ventemodus>>(null);
    const [apiError, setApiError] = React.useState<ApiErrorState>({
        visFeilModal: false,
        feil: null,
    });

    const eierInnloggetSaksbehandlerBehandlingen =
        props.klage.saksbehandler && props.klage.saksbehandler === innloggetSaksbehandler.navIdent;

    const eierIkkeInngloggetSaksbehandlerBehandlingen =
        !eierInnloggetSaksbehandlerBehandlingen && props.klage.saksbehandler;

    const ingenEierBehandling = !props.klage.saksbehandler;

    const kanBehandles =
        kanBehandleKlage(props.klage, props.omgjøringsbehandling) ||
        kanVidereBehandleKlage(props.klage, props.omgjøringsbehandling);

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

    if (!erSaksbehandler || !kanBehandles) {
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
                    {ingenEierBehandling && (
                        <>
                            <ActionMenu.Item
                                onClick={() => {
                                    taKlagebehandling.trigger();
                                }}
                                icon={<PersonIcon aria-hidden />}
                            >
                                Tildel meg
                            </ActionMenu.Item>

                            {erBehandlingSattPåVent(props.klage) && (
                                <>
                                    <ActionMenu.Item
                                        icon={<PlayIcon aria-hidden />}
                                        onClick={() => {
                                            gjenoppta.trigger();
                                        }}
                                    >
                                        Gjenoppta
                                    </ActionMenu.Item>
                                    <ActionMenu.Item
                                        icon={<PauseIcon aria-hidden />}
                                        onClick={() => {
                                            åpneVentemodal('endreVentestatus');
                                        }}
                                    >
                                        Endre ventestatus
                                    </ActionMenu.Item>
                                </>
                            )}
                        </>
                    )}

                    {eierInnloggetSaksbehandlerBehandlingen && (
                        <>
                            <ActionMenu.Item
                                icon={<ArrowLeftIcon aria-hidden />}
                                onClick={() => {
                                    leggTilbake.trigger();
                                }}
                            >
                                Legg tilbake
                            </ActionMenu.Item>

                            {erBehandlingSattPåVent(props.klage) ? (
                                <ActionMenu.Item
                                    icon={<PlayIcon aria-hidden />}
                                    onClick={() => {
                                        gjenoppta.trigger();
                                    }}
                                >
                                    Gjenoppta
                                </ActionMenu.Item>
                            ) : (
                                <ActionMenu.Item
                                    icon={<PauseIcon aria-hidden />}
                                    onClick={() => {
                                        åpneVentemodal('settPåVent');
                                    }}
                                >
                                    Sett på vent
                                </ActionMenu.Item>
                            )}
                            <ActionMenu.Divider />
                            <AvsluttBehandlingMenyvalg
                                setVisAvsluttBehandlingModal={setVisAvsluttBehandlingModal}
                            />
                        </>
                    )}

                    {eierIkkeInngloggetSaksbehandlerBehandlingen && (
                        <ActionMenu.Item
                            icon={<ArrowRightIcon aria-hidden />}
                            onClick={() => {
                                setVisVilOvertaModal(true);
                            }}
                        >
                            Overta behandling
                        </ActionMenu.Item>
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
