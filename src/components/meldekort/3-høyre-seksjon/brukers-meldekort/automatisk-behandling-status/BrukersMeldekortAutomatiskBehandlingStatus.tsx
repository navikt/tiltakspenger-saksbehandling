import { MeldekortBehandletAutomatiskStatus } from '~/types/meldekort/BrukersMeldekort';
import { Alert } from '@navikt/ds-react';
import { ComponentProps } from 'react';

enum MetaStatus {
    Behandlet = 'Behandlet',
    Venter = 'Venter',
    SkalIkkeBehandles = 'SkalIkkeBehandles',
    MeldekortFeil = 'MeldekortFeil',
    SakFeil = 'SakFeil',
    TekniskFeil = 'Teknisk',
}

type Props = {
    status: MeldekortBehandletAutomatiskStatus;
};

export const BrukersMeldekortAutomatiskBehandlingStatus = ({ status }: Props) => {
    const metaStatus = tilMetaStatus[status];
    const metaTekst = tilMetaTekst[metaStatus];

    const statusTekst = tilStatusTekst[status];

    return (
        <Alert variant={alertVariant[metaStatus]} size={'small'} inline={true}>
            {metaTekst ? `${metaTekst}: ` : ''}
            <strong>{statusTekst}</strong>
        </Alert>
    );
};

const alertVariant: Record<MetaStatus, ComponentProps<typeof Alert>['variant']> = {
    [MetaStatus.Behandlet]: 'success',
    [MetaStatus.Venter]: 'info',
    [MetaStatus.SkalIkkeBehandles]: 'info',
    [MetaStatus.MeldekortFeil]: 'warning',
    [MetaStatus.SakFeil]: 'warning',
    [MetaStatus.TekniskFeil]: 'error',
} as const;

const tilMetaTekst: { [key in MetaStatus]?: string } = {
    [MetaStatus.SkalIkkeBehandles]: 'Behandles ikke automatisk',
    [MetaStatus.MeldekortFeil]: 'Tilstand på meldekortet stoppet automatisk behandling',
    [MetaStatus.SakFeil]: 'Tilstand på saken stoppet automatisk behandling',
    [MetaStatus.TekniskFeil]: 'Teknisk feil ved automatisk behandling',
} as const;

const tilMetaStatus: Record<MeldekortBehandletAutomatiskStatus, MetaStatus> = {
    [MeldekortBehandletAutomatiskStatus.BEHANDLET]: MetaStatus.Behandlet,

    [MeldekortBehandletAutomatiskStatus.VENTER_BEHANDLING]: MetaStatus.Venter,

    [MeldekortBehandletAutomatiskStatus.ALLEREDE_BEHANDLET]: MetaStatus.SkalIkkeBehandles,
    [MeldekortBehandletAutomatiskStatus.SKAL_IKKE_BEHANDLES_AUTOMATISK]:
        MetaStatus.SkalIkkeBehandles,

    [MeldekortBehandletAutomatiskStatus.UTDATERT_MELDEPERIODE]: MetaStatus.MeldekortFeil,
    [MeldekortBehandletAutomatiskStatus.FOR_MANGE_DAGER_REGISTRERT]: MetaStatus.MeldekortFeil,
    [MeldekortBehandletAutomatiskStatus.KAN_IKKE_MELDE_HELG]: MetaStatus.MeldekortFeil,
    [MeldekortBehandletAutomatiskStatus.FOR_MANGE_DAGER_GODKJENT_FRAVÆR]: MetaStatus.MeldekortFeil,
    [MeldekortBehandletAutomatiskStatus.INGEN_DAGER_GIR_RETT]: MetaStatus.MeldekortFeil,

    [MeldekortBehandletAutomatiskStatus.ER_UNDER_REVURDERING]: MetaStatus.SakFeil,
    [MeldekortBehandletAutomatiskStatus.HAR_ÅPEN_BEHANDLING]: MetaStatus.SakFeil,
    [MeldekortBehandletAutomatiskStatus.MÅ_BEHANDLE_FØRSTE_KJEDE]: MetaStatus.SakFeil,
    [MeldekortBehandletAutomatiskStatus.MÅ_BEHANDLE_NESTE_KJEDE]: MetaStatus.SakFeil,

    [MeldekortBehandletAutomatiskStatus.HENTE_NAVKONTOR_FEILET]: MetaStatus.TekniskFeil,
    [MeldekortBehandletAutomatiskStatus.BEHANDLING_FEILET_PÅ_SAK]: MetaStatus.TekniskFeil,
    [MeldekortBehandletAutomatiskStatus.UTBETALING_FEILET_PÅ_SAK]: MetaStatus.TekniskFeil,
    [MeldekortBehandletAutomatiskStatus.UKJENT_FEIL]: MetaStatus.TekniskFeil,
} as const;

const tilStatusTekst: Record<MeldekortBehandletAutomatiskStatus, string> = {
    [MeldekortBehandletAutomatiskStatus.BEHANDLET]: 'Automatisk behandlet',
    [MeldekortBehandletAutomatiskStatus.VENTER_BEHANDLING]: 'Venter på automatisk behandling',
    [MeldekortBehandletAutomatiskStatus.ALLEREDE_BEHANDLET]: 'Korrigering',
    [MeldekortBehandletAutomatiskStatus.SKAL_IKKE_BEHANDLES_AUTOMATISK]:
        'Markert som skal ikke behandles automatisk',
    [MeldekortBehandletAutomatiskStatus.UTDATERT_MELDEPERIODE]:
        'Meldekortet er basert på et utdatert vedtak',
    [MeldekortBehandletAutomatiskStatus.ER_UNDER_REVURDERING]: 'Saken er under revurdering',
    [MeldekortBehandletAutomatiskStatus.FOR_MANGE_DAGER_REGISTRERT]:
        'For mange dager registrert på meldekortet',
    [MeldekortBehandletAutomatiskStatus.KAN_IKKE_MELDE_HELG]: 'Saken tillater ikke melding i helg',
    [MeldekortBehandletAutomatiskStatus.FOR_MANGE_DAGER_GODKJENT_FRAVÆR]:
        'For mange sammenhengende dager med godkjent fravær',
    [MeldekortBehandletAutomatiskStatus.HENTE_NAVKONTOR_FEILET]:
        'Henting av brukers Nav-kontor feilet',
    [MeldekortBehandletAutomatiskStatus.BEHANDLING_FEILET_PÅ_SAK]: 'Feil relatert til behandlingen',
    [MeldekortBehandletAutomatiskStatus.UTBETALING_FEILET_PÅ_SAK]:
        'Feil relatert til beregning av utbetalingen',
    [MeldekortBehandletAutomatiskStatus.UKJENT_FEIL]: 'Ukjent feil',
    [MeldekortBehandletAutomatiskStatus.HAR_ÅPEN_BEHANDLING]:
        'Det fantes allerede en åpen meldekortbehandling - vi tillater kun en samtidig åpen behandling',
    [MeldekortBehandletAutomatiskStatus.MÅ_BEHANDLE_FØRSTE_KJEDE]:
        'Første meldeperiode må alltid behandles først',
    [MeldekortBehandletAutomatiskStatus.MÅ_BEHANDLE_NESTE_KJEDE]:
        'Forrige meldeperiode var ikke behandlet - periodene må alltid behandles i kronologisk rekkefølge',
    [MeldekortBehandletAutomatiskStatus.INGEN_DAGER_GIR_RETT]:
        'Ingen dager gir rett i denne meldeperioden',
} as const;
