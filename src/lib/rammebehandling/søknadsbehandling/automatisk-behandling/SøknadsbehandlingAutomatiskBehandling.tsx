import { useSøknadsbehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { Alert } from '@navikt/ds-react';
import React from 'react';
import style from './SøknadsbehandlingAutomatiskBehandling.module.css';
import { TekstListe } from '~/lib/_felles/liste/TekstListe';
import { ManueltBehandlesGrunn } from '~/lib/rammebehandling/typer/Søknadsbehandling';

export const SøknadsbehandlingAutomatiskBehandling = () => {
    const { behandling } = useSøknadsbehandling();
    const manueltBehandlesGrunnerTekst = behandling.manueltBehandlesGrunner.map(
        (grunn) => tekster[grunn],
    );

    return (
        <>
            {behandling.automatiskSaksbehandlet && (
                <Alert variant="info" size="small" className={style.infoboks}>
                    Saksbehandlingen er gjort automatisk.
                </Alert>
            )}
            {manueltBehandlesGrunnerTekst.length > 0 && (
                <Alert variant="warning" size="small" className={style.infoboks}>
                    Kunne ikke behandle saken automatisk:
                    <br />
                    <TekstListe tekster={manueltBehandlesGrunnerTekst} />
                </Alert>
            )}
        </>
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

    ANNET_APEN_BEHANDLING: 'Det finnes en åpen behandling for søker',
    ANNET_VEDTAK_FOR_SAMME_PERIODE: 'Det finnes et annet vedtak som overlapper med søknadsperioden',
    ANNET_HAR_SOKT_FOR_SENT: 'Tiltaksdeltakelsen startet mer enn tre måneder før kravdato',
    ANNET_ER_UNDER_18_I_SOKNADSPERIODEN: 'Bruker er under 18 år i søknadsperioden',
} as const;
