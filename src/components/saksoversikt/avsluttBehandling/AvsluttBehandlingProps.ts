import { BehandlingId } from '~/types/Behandling';
import { SøknadId } from '~/types/Søknad';

export type AvsluttBehandlingProps = {
    saksnummer: string;
    button?: {
        text?: string;
    };
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
} & SøknadIdEllerBehandlingId;

export type SøknadIdEllerBehandlingId =
    | { søknadId: SøknadId; behandlingId?: never }
    | { behandlingId: BehandlingId; søknadId?: never };
