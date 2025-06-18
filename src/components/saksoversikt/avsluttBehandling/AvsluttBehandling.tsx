import { Button, VStack } from '@navikt/ds-react';
import React from 'react';
import styles from './AvsluttBehandling.module.css';
import { BehandlingId } from '~/types/BehandlingTypes';
import { SøknadId } from '~/types/SøknadTypes';
import { Nullable } from '~/types/UtilTypes';
import AvsluttBehandlingModal from '~/components/saksoversikt/avsluttBehandling/AvsluttBehandlingModal';

const AvsluttBehandling = (props: {
    saksnummer: string;
    søknadsId?: Nullable<SøknadId>;
    behandlingsId?: Nullable<BehandlingId>;
    button?: {
        size?: 'small' | 'medium';
        alignment?: 'start' | 'end';
        text?: string;
    };
    minWidth?: boolean;
    onSuccess?: () => void;
    /**
     * overstying av tekster i modalen. Default er generell behandlings-realterte tekster
     *
     * TODO - dette blir ikke så veldig smooth når vi skal ha forskjeller på de ulike behandlingstypene
     */
    modal?: {
        tittel?: string;
        tekst?: string;
        textareaLabel?: string;
        primaryButtonText?: string;
        secondaryButtonText?: string;
    };
}) => {
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

export default AvsluttBehandling;
