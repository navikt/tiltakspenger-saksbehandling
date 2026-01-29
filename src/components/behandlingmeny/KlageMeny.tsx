import React from 'react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import router from 'next/router';
import { Klagebehandling } from '~/types/Klage';
import { finnUrlForKlageSteg } from '~/utils/klageUtils';
import AvsluttBehandlingMenyvalg from '../personoversikt/avsluttBehandling/AvsluttBehandlingMenyvalg';
import AvsluttBehandlingModal from '../modaler/AvsluttBehandlingModal';
import { useSak } from '~/context/sak/SakContext';
import { useAvbrytKlagebehandling } from '~/api/KlageApi';

const KlageMeny = (props: { klage: Klagebehandling }) => {
    const { setSak } = useSak();
    const [visAvsluttBehandlingModal, setVisAvsluttBehandlingModal] = React.useState(false);

    const avbrytKlageBehandling = useAvbrytKlagebehandling({
        sakId: props.klage.sakId,
        klageId: props.klage.id,
        onSuccess: (sak) => {
            setSak(sak);
            setVisAvsluttBehandlingModal(false);
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
                    <ActionMenu.Item onSelect={() => router.push(finnUrlForKlageSteg(props.klage))}>
                        Åpne
                    </ActionMenu.Item>

                    <ActionMenu.Divider />
                    <AvsluttBehandlingMenyvalg
                        setVisAvsluttBehandlingModal={setVisAvsluttBehandlingModal}
                    />
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
        </div>
    );
};

export default KlageMeny;
