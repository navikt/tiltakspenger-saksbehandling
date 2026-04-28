import React from 'react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronDownIcon,
    FileIcon,
    PauseIcon,
    PersonIcon,
    PlayIcon,
} from '@navikt/aksel-icons';
import { ActionMenu, Button, LocalAlert, Modal } from '@navikt/ds-react';
import router from 'next/router';
import { Klagebehandling } from '~/types/Klage';
import {
    finnSisteGyldigeStegForKlage,
    kanBehandleKlage,
    kanVidereBehandleKlage,
} from '~/utils/klageUtils';
import AvsluttBehandlingMenyvalg from '../personoversikt/avsluttBehandling/AvsluttBehandlingMenyvalg';
import AvsluttBehandlingModal from '../modaler/AvsluttBehandlingModal';
import { useSak } from '~/context/sak/SakContext';
import {
    useAvbrytKlagebehandling,
    useGjenopptaKlagebehandling,
    useLeggKlagebehandlingTilbake,
    useOvertaKlagebehandling,
    useSettKlagebehandlingPåVent,
    useTaKlagebehandling,
} from '~/lib/klage/api/KlageApi';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import OvertabehandlingModal from './OvertaBehandlingModal';
import SettBehandlingPåVentModal from '../modaler/SettBehandlingPåVentModal';
import { FetcherError } from '~/utils/fetch/fetch';
import { Nullable } from '~/types/UtilTypes';
import { Rammebehandling } from '~/types/Rammebehandling';

const KlageMeny = (props: {
    klage: Klagebehandling;
    omgjøringsbehandling: Nullable<Rammebehandling>;
}) => {
    const { setSak } = useSak();
    const { innloggetSaksbehandler } = useSaksbehandler();
    const [visVilOvertaModal, setVisVilOvertaModal] = React.useState(false);
    const [visAvsluttBehandlingModal, setVisAvsluttBehandlingModal] = React.useState(false);
    const [visSettBehandlingPåVentModal, setVisSettBehandlingPåVentModal] = React.useState(false);
    const [apiError, setApiError] = React.useState<{
        visFeilModal: boolean;
        feil: Nullable<FetcherError>;
    }>({ visFeilModal: false, feil: null });

    const eierInnloggetSaksbehandlerBehandlingen =
        props.klage.saksbehandler && props.klage.saksbehandler === innloggetSaksbehandler.navIdent;

    const eierIkkeInngloggetSaksbehandlerBehandlingen =
        !eierInnloggetSaksbehandlerBehandlingen && props.klage.saksbehandler;

    const ingenEierBehandling = !props.klage.saksbehandler;

    const avbrytKlageBehandling = useAvbrytKlagebehandling({
        sakId: props.klage.sakId,
        klageId: props.klage.id,
        onSuccess: (sak) => {
            setSak(sak);
            setVisAvsluttBehandlingModal(false);
        },
    });

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
            setVisSettBehandlingPåVentModal(false);
        },
    });

    const gjenoppta = useGjenopptaKlagebehandling({
        sakId: props.klage.sakId,
        klageId: props.klage.id,
        onSuccess: (sak) => {
            setSak(sak);
            router.push(finnSisteGyldigeStegForKlage(props.klage));
        },
        onError: (error) => setApiError({ visFeilModal: true, feil: error }),
    });

    return (
        <div>
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
                    <ActionMenu.Item
                        onSelect={() => router.push(finnSisteGyldigeStegForKlage(props.klage))}
                        icon={
                            eierInnloggetSaksbehandlerBehandlingen ? (
                                <ArrowRightIcon aria-hidden />
                            ) : (
                                <FileIcon aria-hidden />
                            )
                        }
                    >
                        {eierInnloggetSaksbehandlerBehandlingen &&
                        (kanBehandleKlage(props.klage, props.omgjøringsbehandling) ||
                            kanVidereBehandleKlage(props.klage, props.omgjøringsbehandling))
                            ? 'Fortsett'
                            : 'Se behandling'}
                    </ActionMenu.Item>

                    {ingenEierBehandling &&
                        (kanBehandleKlage(props.klage, props.omgjøringsbehandling) ||
                            kanVidereBehandleKlage(props.klage, props.omgjøringsbehandling)) && (
                            <>
                                <ActionMenu.Divider />
                                <ActionMenu.Item
                                    onClick={() => {
                                        taKlagebehandling.trigger();
                                    }}
                                    icon={<PersonIcon aria-hidden />}
                                >
                                    Tildel meg
                                </ActionMenu.Item>

                                {props.klage.ventestatus.at(-1)?.erSattPåVent && (
                                    <ActionMenu.Item
                                        icon={<PlayIcon aria-hidden />}
                                        onClick={() => {
                                            gjenoppta.trigger();
                                        }}
                                    >
                                        Gjenoppta
                                    </ActionMenu.Item>
                                )}
                            </>
                        )}

                    {eierInnloggetSaksbehandlerBehandlingen &&
                        (kanBehandleKlage(props.klage, props.omgjøringsbehandling) ||
                            kanVidereBehandleKlage(props.klage, props.omgjøringsbehandling)) && (
                            <>
                                <ActionMenu.Item
                                    icon={<ArrowLeftIcon aria-hidden />}
                                    onClick={() => {
                                        leggTilbake.trigger();
                                    }}
                                >
                                    Legg tilbake
                                </ActionMenu.Item>

                                {props.klage.ventestatus.at(-1)?.erSattPåVent ? (
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
                                            setVisSettBehandlingPåVentModal(true);
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

                    {eierIkkeInngloggetSaksbehandlerBehandlingen &&
                        (kanBehandleKlage(props.klage, props.omgjøringsbehandling) ||
                            kanVidereBehandleKlage(props.klage, props.omgjøringsbehandling)) && (
                            <>
                                <ActionMenu.Divider />
                                {props.klage.saksbehandler && (
                                    <ActionMenu.Item
                                        icon={<ArrowRightIcon aria-hidden />}
                                        onClick={() => {
                                            setVisVilOvertaModal(true);
                                        }}
                                    >
                                        Overta behandling
                                    </ActionMenu.Item>
                                )}
                            </>
                        )}
                </ActionMenu.Content>
            </ActionMenu>
            {visAvsluttBehandlingModal && (
                <AvsluttBehandlingModal
                    åpen={visAvsluttBehandlingModal}
                    onClose={() => setVisAvsluttBehandlingModal(false)}
                    tittel={`Avslutt klagebehandling`}
                    tekst={`Er du sikker på at du vil avslutte klagebehandlingen?`}
                    textareaLabel={`Hvorfor avsluttes klagebehandlingen? (obligatorisk)`}
                    onSubmit={(begrunnelse: string) => {
                        avbrytKlageBehandling.trigger({ begrunnelse });
                    }}
                    footer={{
                        isMutating: avbrytKlageBehandling.isMutating,
                        error: avbrytKlageBehandling.error
                            ? avbrytKlageBehandling.error.message
                            : null,
                    }}
                />
            )}
            {visVilOvertaModal && (
                <OvertabehandlingModal
                    åpen={visVilOvertaModal}
                    onClose={() => setVisVilOvertaModal(false)}
                    //knappen for å overta rendres kun dersom saksbehandler finnes
                    overtarFra={props.klage.saksbehandler!}
                    api={{
                        trigger: overtaKlagebehandling.trigger,
                        isMutating: overtaKlagebehandling.isMutating,
                        error: overtaKlagebehandling.error ?? null,
                    }}
                />
            )}
            {visSettBehandlingPåVentModal && (
                <SettBehandlingPåVentModal
                    åpen={visSettBehandlingPåVentModal}
                    onClose={() => setVisSettBehandlingPåVentModal(false)}
                    api={{
                        trigger: (begrunnelse, frist) => settPåVent.trigger({ begrunnelse, frist }),
                        isMutating: settPåVent.isMutating,
                        error: settPåVent.error ?? null,
                    }}
                />
            )}
            {apiError.visFeilModal && (
                <ApiErrorFeilModal
                    åpen={apiError.visFeilModal}
                    onClose={() => setApiError({ visFeilModal: false, feil: null })}
                    error={apiError.feil!}
                />
            )}
        </div>
    );
};

export const ApiErrorFeilModal = (props: {
    åpen: boolean;
    onClose: () => void;
    error: FetcherError;
}) => {
    return (
        <Modal aria-label="Feil ved handling" open={props.åpen} onClose={props.onClose}>
            <Modal.Body>
                {props.error && (
                    <LocalAlert status="error">
                        <LocalAlert.Header>
                            <LocalAlert.Title>En feil skjedde</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>{props.error.message}</LocalAlert.Content>
                    </LocalAlert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onClose} size="small">
                    Lukk
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default KlageMeny;
