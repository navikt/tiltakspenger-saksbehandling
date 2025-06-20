import { Nullable } from '~/types/UtilTypes';
import { SøknadId } from '~/types/SøknadTypes';
import { BehandlingId } from '~/types/BehandlingTypes';

export type AvsluttBehandlingProps = {
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
};
