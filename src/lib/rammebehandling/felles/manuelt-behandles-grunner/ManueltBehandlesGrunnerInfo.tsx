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
        <Infokort
            header={'Kunne ikke behandle saken automatisk'}
            variant={'advarsel'}
            size={'small'}
            className={className}
        >
            <TekstListe size={'small'} tekster={grunner.map((grunn) => tekster[grunn])} />
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
    SAKSOPPLYSNING_HAR_LONNSTILSKUDD: 'Bruker har lønnstilskudd i søknadsperioden',
    SAKSOPPLYSNING_HAR_TILTAK_SOM_FRATAR_RETT:
        'Bruker har tiltak som fratar rett til tiltakspenger i søknadsperioden',
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
    STANS_INGEN_INNVILGEDE_DAGER_ETTER_SISTE_UTBETALING:
        'Alle innvilgede dager for tiltaksdeltakelsen etter sluttdatoen er allerede utbetalt',
    STANS_ANDRE_DELTAKELSER_INNVILGET_ETTER_SLUTTDATO:
        'Bruker har andre tiltaksdeltakelser som er innvilget etter sluttdatoen',
    STANS_UTBETALING_SIMULERING_MANGLER: 'Utbetalingen for stansen mangler simulering',
    STANS_UTBETALING_STOTTER_IKKE_FEILUTBETALING:
        'Simuleringen av stansen gir feilutbetaling, som ikke støttes for stans',
    STANS_UTBETALING_STOTTER_IKKE_JUSTERING:
        'Simuleringen av stansen gir justering, som ikke støttes for stans',
    STANS_UTBETALING_KONTROLLSIMULERING_HAR_ENDRINGER:
        'Kontrollsimuleringen av stansen avviker fra simuleringen',
    STANS_KAN_IKKE_FYLLES_UT: 'Stansen kunne ikke fylles ut automatisk',
    STANS_UGYLDIGE_MELDEPERIODER_FOR_HELG: 'Stansen gir ugyldige meldeperioder for helg',
    STANS_KAN_IKKE_SENDES_TIL_BESLUTNING: 'Stansen kunne ikke sendes til beslutning automatisk',

    FORLENGELSE_FANT_IKKE_GJELDENDE_VEDTAK:
        'Fant ikke et gjeldende vedtak som innvilger tiltaksdeltakelsen',
    FORLENGELSE_VEDTAKET_ER_STANSET_ELLER_OPPHORT:
        'Det gjeldende vedtaket er stanset, opphørt eller omgjort før sluttdatoen',
    FORLENGELSE_INNVILGELSEN_SLUTTER_FOR_DELTAKELSEN:
        'Det gjeldende vedtaket slutter før den tidligere sluttdatoen for tiltaksdeltakelsen',
    FORLENGELSE_FANT_IKKE_TILTAKSDELTAKELSE: 'Fant ikke tiltaksdeltakelsen som endringen gjelder',
    FORLENGELSE_DELTAKELSEN_HAR_UGYLDIG_STATUS:
        'Tiltaksdeltakelsen har en status som ikke gir rett til tiltakspenger',
    FORLENGELSE_TILTAKET_GIR_IKKE_RETT: 'Tiltaket gir ikke rett til tiltakspenger',
    FORLENGELSE_DELTAKELSEN_MANGLER_SLUTTDATO: 'Tiltaksdeltakelsen mangler sluttdato',
    FORLENGELSE_SLUTTDATO_ER_IKKE_ETTER_INNVILGELSEN:
        'Ny sluttdato for tiltaksdeltakelsen er ikke etter siste innvilgede dag',
    FORLENGELSE_ENDRET_STARTDATO: 'Startdatoen for tiltaksdeltakelsen er endret',
    FORLENGELSE_ENDRET_DELTAKELSESMENGDE_OG_KAN_MELDE_I_HELG:
        'Deltakelsesmengden for tiltaksdeltakelsen er endret, og bruker kan melde i helg',
    FORLENGELSE_KAN_IKKE_UTLEDE_DELTAKELSESMENGDE:
        'Deltakelsesmengden for tiltaksdeltakelsen er endret, men mangler både dager per uke og prosent, eller er mer enn fulltid',
    FORLENGELSE_DELTAKELSESMENGDE_GIR_IKKE_HELE_DAGER:
        'Deltakelsesmengden for tiltaksdeltakelsen er endret, men gir ikke et helt antall dager per meldeperiode',
    FORLENGELSE_KAN_IKKE_UTLEDE_BARNETILLEGG:
        'Barnetillegget i det gjeldende vedtaket samsvarer ikke med barna i søknaden',
    FORLENGELSE_OVERLAPPER_ANDRE_VEDTAK: 'Forlengelsen overlapper med andre vedtak på saken',
    FORLENGELSE_OVERLAPPENDE_TILTAK:
        'Bruker har overlappende tiltaksdeltakelser i forlengelsesperioden',
    FORLENGELSE_ANDRE_YTELSER: 'Bruker mottar andre ytelser',
    FORLENGELSE_VEDTAK_I_ARENA: 'Det finnes tiltakspengevedtak i Arena',
    FORLENGELSE_UTBETALING_SIMULERING_MANGLER: 'Utbetalingen for forlengelsen mangler simulering',
    FORLENGELSE_UTBETALING_STOTTER_IKKE_FEILUTBETALING:
        'Simuleringen av forlengelsen gir feilutbetaling, som ikke støttes for forlengelse',
    FORLENGELSE_UTBETALING_STOTTER_IKKE_JUSTERING:
        'Simuleringen av forlengelsen gir justering, som ikke støttes for forlengelse',
    FORLENGELSE_UTBETALING_KONTROLLSIMULERING_HAR_ENDRINGER:
        'Kontrollsimuleringen av forlengelsen avviker fra simuleringen',
    FORLENGELSE_KAN_IKKE_FYLLES_UT: 'Forlengelsen kunne ikke fylles ut automatisk',
    FORLENGELSE_UGYLDIGE_MELDEPERIODER_FOR_HELG: 'Forlengelsen gir ugyldige meldeperioder for helg',
    FORLENGELSE_KAN_IKKE_SENDES_TIL_BESLUTNING:
        'Forlengelsen kunne ikke sendes til beslutning automatisk',

    ANNET_APEN_BEHANDLING: 'Det finnes en annen åpen behandling på saken',
    ANNET_VEDTAK_FOR_SAMME_PERIODE: 'Det finnes et annet vedtak som overlapper med søknadsperioden',
    ANNET_HAR_SOKT_FOR_SENT: 'Tiltaksdeltakelsen startet mer enn tre måneder før kravdato',
    ANNET_ER_UNDER_18_I_SOKNADSPERIODEN: 'Bruker er under 18 år i søknadsperioden',
} as const;
