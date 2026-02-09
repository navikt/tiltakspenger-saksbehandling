import React from 'react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronDownIcon,
    FileIcon,
    PauseIcon,
    PersonIcon,
} from '@navikt/aksel-icons';
import { ActionMenu, Button, LocalAlert, Modal } from '@navikt/ds-react';
import router from 'next/router';
import { Klagebehandling } from '~/types/Klage';
import { finnUrlForKlageSteg } from '~/utils/klageUtils';
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
} from '~/api/KlageApi';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import OvertabehandlingModal from './OvertaBehandlingModal';
import SettBehandlingPåVentModal from '../modaler/SettBehandlingPåVentModal';
import { FetcherError } from '~/utils/fetch/fetch';
import { Nullable } from '~/types/UtilTypes';

const KlageMeny = (props: { klage: Klagebehandling }) => {
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

    const eierIkkeInngloggetSaksbehandlerBehandlingen = !eierInnloggetSaksbehandlerBehandlingen;

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
            router.push(finnUrlForKlageSteg(props.klage));
        },
    });

    const overtaKlagebehandling = useOvertaKlagebehandling({
        sakId: props.klage.sakId,
        klageId: props.klage.id,
        onSuccess: (sak) => {
            setSak(sak);
            router.push(finnUrlForKlageSteg(props.klage));
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
        onSuccess: (sak) => setSak(sak),
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
                        onSelect={() => router.push(finnUrlForKlageSteg(props.klage))}
                        icon={
                            eierInnloggetSaksbehandlerBehandlingen ? (
                                <ArrowRightIcon aria-hidden />
                            ) : (
                                <FileIcon aria-hidden />
                            )
                        }
                    >
                        {eierInnloggetSaksbehandlerBehandlingen ? 'Fortsett' : 'Se behandling'}
                    </ActionMenu.Item>

                    {ingenEierBehandling && (
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

                            {props.klage.ventestatus?.erSattPåVent ? (
                                <ActionMenu.Item
                                    icon={<PauseIcon aria-hidden />}
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

                    {eierIkkeInngloggetSaksbehandlerBehandlingen && (
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
                        trigger: (begrunnelse) => settPåVent.trigger({ begrunnelse }),
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

const ApiErrorFeilModal = (props: { åpen: boolean; onClose: () => void; error: FetcherError }) => {
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
