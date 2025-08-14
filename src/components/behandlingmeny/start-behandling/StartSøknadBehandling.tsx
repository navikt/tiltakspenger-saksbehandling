import React from 'react';
import router from 'next/router';
import { ActionMenu, Button } from '@navikt/ds-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { useStartSøknadBehandling } from './useStartSøknadBehandling';
import Varsel from '../../varsel/Varsel';
import AvsluttBehandlingModal from '~/components/modaler/AvsluttBehandlingModal';
import AvsluttBehandlingMenyvalg from '~/components/saksoversikt/avsluttBehandling/AvsluttBehandlingMenyvalg';
import { SøknadForOversiktProps } from '~/types/SøknadTypes';
import { BehandlingStatus } from '~/types/BehandlingTypes';
import style from '../BehandlingKnapper.module.css';

type Props = {
    søknad: SøknadForOversiktProps;
    medAvsluttBehandling?: boolean;
};

export const StartSøknadBehandling = ({ søknad, medAvsluttBehandling }: Props) => {
    const { opprettBehandling, opprettBehandlingError } = useStartSøknadBehandling(søknad);
    const [visAvsluttBehandlingModal, setVisAvsluttBehandlingModal] = React.useState(false);

    const startBehandling = () => {
        opprettBehandling().then((behandling) => {
            if (behandling) {
                router.push(`/behandling/${behandling.id}`);
            }
        });
    };

    return (
        <>
            {opprettBehandlingError && (
                <Varsel
                    size="small"
                    variant="error"
                    melding={opprettBehandlingError.message}
                    className={style.varsel}
                    key={Date.now()}
                />
            )}
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
                    <ActionMenu.Item onClick={startBehandling}>Opprett behandling</ActionMenu.Item>
                    {medAvsluttBehandling && (
                        <>
                            <ActionMenu.Divider />
                            <AvsluttBehandlingMenyvalg
                                skalVises={medAvsluttBehandling}
                                setVisAvsluttBehandlingModal={setVisAvsluttBehandlingModal}
                                søknadId={søknad.id}
                                saksnummer={søknad.saksnummer}
                                behandlingStatus={BehandlingStatus.SØKNAD}
                                button={{ text: 'Avslutt søknad' }}
                            />
                        </>
                    )}
                </ActionMenu.Content>
            </ActionMenu>
            {medAvsluttBehandling && visAvsluttBehandlingModal && (
                <AvsluttBehandlingModal
                    åpen={visAvsluttBehandlingModal}
                    onClose={() => setVisAvsluttBehandlingModal(false)}
                    saksnummer={søknad.saksnummer}
                    søknadId={søknad.id}
                    tittel={'Avslutt søknad'}
                    tekst={'Er du sikker på at du vil avslutte søknaden?'}
                    textareaLabel={'Hvorfor avsluttes søknaden? (Obligatorisk)'}
                    footer={{
                        primaryButtonText: 'Avslutt søknad',
                        secondaryButtonText: 'Ikke avslutt søknad',
                    }}
                />
            )}
        </>
    );
};
