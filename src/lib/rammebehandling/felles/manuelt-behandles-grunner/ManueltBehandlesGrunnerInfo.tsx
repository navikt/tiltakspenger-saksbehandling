import { BodyShort } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { TekstListe } from '~/lib/_felles/liste/TekstListe';
import { ManueltBehandlesGrunn } from '~/lib/rammebehandling/typer/Rammebehandling';

type Props = {
    grunner: ManueltBehandlesGrunn[];
    className?: string;
};

export const ManueltBehandlesGrunnerInfo = ({ grunner, className }: Props) => {
    if (grunner.length === 0) {
        return null;
    }

    return (
        <Infokort variant={'advarsel'} size="small" className={className}>
            <BodyShort spacing={true}>{'Kunne ikke behandle saken automatisk:'}</BodyShort>
            <TekstListe tekster={grunner.map((grunn) => tekster[grunn])} />
        </Infokort>
    );
};

const tekster: Record<ManueltBehandlesGrunn, string> = {
    SOKNAD_HAR_ANDRE_YTELSER: 'Bruker har svart ja på spørsmål om andre ytelser i søknaden',
    SOKNAD_HAR_LAGT_TIL_BARN_MANUELT: 'Bruker har lagt til barn manuelt i søknaden',
    SOKNAD_BARN_UTENFOR_EOS: 'Bruker har barn som oppholder seg utenfor EØS',
    SOKNAD_BARN_FYLLER_16_I_SOKNADSPERIODEN:
        'Bruker har barn som fyller 16 år i løpet av søknadsperioden',
    SOKNAD_BARN_FODT_I_SOKNADSPERIODEN: 'Bruker har fått barn i løpet av søknadsperioden',
    SOKNAD_HAR_KVP: 'Bruker har svart ja på spørsmål om KVP i søknaden',
    SOKNAD_INTRO: 'Bruker har svart ja på spørsmål om introduksjonsstønad i søknaden',
    SOKNAD_INSTITUSJONSOPPHOLD: 'Bruker har svart ja på spørsmål om institusjonsopphold i søknaden',

    SAKSOPPLYSNING_FANT_IKKE_TILTAK: 'Fant ikke tiltaksdeltakelsen det er søkt for',
    SAKSOPPLYSNING_TILTAK_MANGLER_PERIODE: 'Tiltaksdeltakelsen det er søkt for mangler periode',
    SAKSOPPLYSNING_TILTAK_MANGLER_DELTAKELSESMENGDE:
        'Tiltaksdeltakelsen det er søkt for mangler antall dager per uke og deltakelsesprosent',
    SAKSOPPLYSNING_TILTAK_MER_ENN_FEM_DAGER_PER_UKE:
        'Tiltaksdeltakelsen det er søkt for er mer enn fem dager i uken',
    SAKSOPPLYSNING_DELTIDSTILTAK_UTEN_DAGER_PER_UKE:
        'Tiltaksdeltakelsen det er søkt for er et deltidstiltak, men mangler antall dager per uke',
    SAKSOPPLYSNING_OVERLAPPENDE_TILTAK:
        'Bruker har overlappende tiltaksdeltakelser i søknadsperioden',
    SAKSOPPLYSNING_MINDRE_ENN_14_DAGER_MELLOM_TILTAK_OG_SOKNAD:
        'Bruker har tiltaksdeltakelse som starter eller slutter mindre enn 14 dager før eller etter søknadsperioden',
    SAKSOPPLYSNING_ULIK_TILTAKSPERIODE:
        'Tiltaksdeltakelsen har ikke samme periode som det er søkt for',
    SAKSOPPLYSNING_HAR_IKKE_DELTATT_PA_TILTAK:
        'Bruker har ikke deltatt på tiltaket det er søkt for',
    SAKSOPPLYSNING_ANDRE_YTELSER: 'Bruker mottar andre ytelser i søknadsperioden',
    SAKSOPPLYSNING_VEDTAK_I_ARENA:
        'Det finnes tiltakspengevedtak i Arena som kan overlappe med søknadsperioden',
    SAKSOPPLYSNING_MANGLER_FULLSTENDIG_PERIODE:
        'Tiltaksdeltakelsen mangler fra og med dato og/eller til og med dato',

    STANS_FANT_IKKE_TILTAKSDELTAKELSE: 'Fant ikke tiltaksdeltakelsen som endringen gjelder',
    STANS_DELTAKELSEN_ER_IKKE_AVSLUTTET:
        'Tiltaksdeltakelsen er ikke registrert som avbrutt, fullført eller sluttet',
    STANS_DELTAKELSEN_MANGLER_SLUTTDATO: 'Tiltaksdeltakelsen mangler sluttdato',
    STANS_SLUTTDATO_ER_IKKE_PASSERT: 'Sluttdatoen for tiltaksdeltakelsen er ikke passert ennå',
    STANS_INGEN_INNVILGEDE_DAGER_ETTER_SLUTTDATO:
        'Det er ingen innvilgede dager for tiltaksdeltakelsen etter sluttdatoen',
    STANS_ANDRE_DELTAKELSER_INNVILGET_ETTER_SLUTTDATO:
        'Bruker har andre tiltaksdeltakelser som er innvilget etter sluttdatoen',
    STANS_UTBETALING_KAN_IKKE_IVERKSETTES: 'Utbetalingen for stansen kan ikke iverksettes',
    STANS_KAN_IKKE_SENDES_TIL_BESLUTNING:
        'Stansen kunne ikke fylles ut eller sendes til beslutning automatisk',

    ANNET_APEN_BEHANDLING: 'Det finnes en annen åpen behandling på saken',
    ANNET_VEDTAK_FOR_SAMME_PERIODE: 'Det finnes et annet vedtak som overlapper med søknadsperioden',
    ANNET_HAR_SOKT_FOR_SENT: 'Tiltaksdeltakelsen startet mer enn tre måneder før kravdato',
    ANNET_ER_UNDER_18_I_SOKNADSPERIODEN: 'Bruker er under 18 år i søknadsperioden',
} as const;
