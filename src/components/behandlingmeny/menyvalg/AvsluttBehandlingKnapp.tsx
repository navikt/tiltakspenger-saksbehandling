import { Button, VStack } from '@navikt/ds-react';
import React from 'react';
import styles from '../../saksoversikt/avsluttBehandling/AvsluttBehandling.module.css';
import AvsluttBehandlingModal from '~/components/modaler/AvsluttBehandlingModal';
import { AvsluttBehandlingProps } from '~/components/saksoversikt/avsluttBehandling/AvsluttBehandlingProps';

const AvsluttBehandlingKnapp = (props: AvsluttBehandlingProps) => {
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = React.useState(false);

    //TODO - her burde vi nok ha litt mer context rundt hva som er valgt
    if (!props.søknadsId && !props.behandlingsId) {
        return <div>Teknisk feil: Enten søknadsId, eller behandlingsId må være satt</div>;
    }

    return (
        <VStack className={props.minWidth ? styles.avsluttBehandlingContainer : undefined}>
            {vilAvslutteBehandling && (
                <AvsluttBehandlingModal
                    åpen={vilAvslutteBehandling}
                    onClose={() => setVilAvslutteBehandling(false)}
                    saksnummer={props.saksnummer}
                    søknadsId={props.søknadsId ?? null}
                    behandlingsId={props.behandlingsId ?? null}
                    onSuccess={props.onSuccess}
                    tittel={props.modal?.tittel}
                    tekst={props.modal?.tekst}
                    textareaLabel={props.modal?.textareaLabel}
                    footer={{
                        primaryButtonText: props.modal?.primaryButtonText,
                        secondaryButtonText: props.modal?.secondaryButtonText,
                    }}
                />
            )}
            <Button
                variant="secondary"
                type="button"
                size={props.button?.size ?? 'small'}
                onClick={() => setVilAvslutteBehandling(true)}
            >
                {props.button?.text ?? props.modal?.tittel ?? 'Avslutt behandling'}
            </Button>
        </VStack>
    );
};

export default AvsluttBehandlingKnapp;
