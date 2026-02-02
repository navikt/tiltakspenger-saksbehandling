import React from 'react';
import { ArrowRightIcon, ChevronDownIcon, FileIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import router from 'next/router';
import { Klagebehandling } from '~/types/Klage';
import { finnUrlForKlageSteg } from '~/utils/klageUtils';
import AvsluttBehandlingMenyvalg from '../personoversikt/avsluttBehandling/AvsluttBehandlingMenyvalg';
import AvsluttBehandlingModal from '../modaler/AvsluttBehandlingModal';
import { useSak } from '~/context/sak/SakContext';
import { useAvbrytKlagebehandling, useOvertaKlagebehandling } from '~/api/KlageApi';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import OvertabehandlingModal from './OvertaBehandlingModal';

const KlageMeny = (props: { klage: Klagebehandling }) => {
    const { setSak } = useSak();
    const { innloggetSaksbehandler } = useSaksbehandler();
    const [visAvsluttBehandlingModal, setVisAvsluttBehandlingModal] = React.useState(false);
    const [visVilOvertaModal, setVisVilOvertaModal] = React.useState(false);

    const eierInnloggetSaksbehandlerBehandlingen =
        innloggetSaksbehandler.navIdent === props.klage.saksbehandler;

    const avbrytKlageBehandling = useAvbrytKlagebehandling({
        sakId: props.klage.sakId,
        klageId: props.klage.id,
        onSuccess: (sak) => {
            setSak(sak);
            setVisAvsluttBehandlingModal(false);
        },
    });

    const overtaKlageBehandling = useOvertaKlagebehandling({
        sakId: props.klage.sakId,
        klageId: props.klage.id,
        onSuccess: (sak) => {
            setSak(sak);
            setVisVilOvertaModal(false);
        },
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

                    {eierInnloggetSaksbehandlerBehandlingen && (
                        <>
                            <ActionMenu.Divider />
                            <AvsluttBehandlingMenyvalg
                                setVisAvsluttBehandlingModal={setVisAvsluttBehandlingModal}
                            />
                        </>
                    )}

                    {!eierInnloggetSaksbehandlerBehandlingen && (
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
                        trigger: overtaKlageBehandling.trigger,
                        isMutating: overtaKlageBehandling.isMutating,
                        error: overtaKlageBehandling.error ?? null,
                    }}
                />
            )}
        </div>
    );
};

export default KlageMeny;
