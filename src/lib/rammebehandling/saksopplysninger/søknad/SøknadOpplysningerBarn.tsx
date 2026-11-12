import { BodyShort, HStack, Loader, VStack } from '@navikt/ds-react';
import { nonNullish } from '~/utils/object';
import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import {
    alderFraDato,
    finn16årsdag,
    formaterDatotekst,
    formaterSladdbarDatotekst,
} from '~/utils/date';
import { formaterSladdbarVerdi, hentVerdi, sladdbarTekst } from '~/utils/sladdetVerdi';
import { erDatoIPeriode } from '~/utils/periode';
import { Periode } from '~/types/Periode';
import { Søknad, SøknadBarn } from '~/lib/søknad/søknadTyper';
import { useHentPersonopplysningerBarn } from '~/lib/søknad/manuell-søknad/barnetillegg/useHentPersonopplysningerBarn';
import { useSak } from '~/lib/sak/SakContext';
import { Personopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import { Nullable } from '~/types/UtilTypes';

import style from './SøknadOpplysningerBarn.module.css';
import { formaterSøknadsspørsmålSvar, oppholdsstedTekst } from '~/lib/søknad/søknadTekster';

type Props = {
    tiltaksperiode: Nullable<Periode>;
    søknad: Søknad;
};

export const SøknadOpplysningerBarn = ({ tiltaksperiode, søknad }: Props) => {
    const getBarnetilleggTekst = () => {
        if (søknad.svar.harSøktOmBarnetillegg.svar === 'JA') {
            return (
                formaterSøknadsspørsmålSvar(søknad.svar.harSøktOmBarnetillegg.svar) +
                ' - barn ikke oppgitt'
            );
        } else {
            return formaterSøknadsspørsmålSvar(søknad.svar.harSøktOmBarnetillegg.svar);
        }
    };

    return (
        <div className={style.wrapper}>
            <BodyShort spacing={true}>{'Barn:'}</BodyShort>
            {søknad.barnetillegg.length > 0 ? (
                <MedBarn tiltaksperiode={tiltaksperiode} søknad={søknad} />
            ) : (
                <BehandlingSaksopplysning
                    navn="Har søkt om barnetillegg"
                    verdi={getBarnetilleggTekst()}
                    visVarsel={
                        søknad.barnetillegg.length === 0 &&
                        søknad.svar.harSøktOmBarnetillegg.svar !== 'NEI'
                    }
                />
            )}
        </div>
    );
};

const MedBarn = ({ tiltaksperiode, søknad }: Props) => {
    const { sak } = useSak();

    const personopplysningerBarn = useHentPersonopplysningerBarn(
        sak.sakId,
        søknad.barnetillegg.length > 0,
    );

    return (
        <VStack gap={'space-16'}>
            {personopplysningerBarn.isLoading && (
                <HStack gap="space-8" align="center">
                    <Loader size="small" title="Henter skjermingsinformasjon for barn..." />
                    <BodyShort size="small">Henter skjermingsinformasjon for barn...</BodyShort>
                </HStack>
            )}
            {søknad.barnetillegg
                .toSorted((a, b) =>
                    (hentVerdi(a.fødselsdato) ?? '') > (hentVerdi(b.fødselsdato) ?? '') ? 1 : -1,
                )
                .map((barn, index) => {
                    const { fnr, fødselsdato, fornavn } = barn;

                    const fnrVerdi = hentVerdi(fnr);

                    const personopplysninger = fnrVerdi
                        ? personopplysningerBarn.data?.find((p) => hentVerdi(p.fnr) === fnrVerdi)
                        : undefined;

                    return (
                        <Barn
                            barn={barn}
                            tiltaksperiode={tiltaksperiode}
                            personopplysninger={personopplysninger}
                            key={
                                fnrVerdi ??
                                `${hentVerdi(fødselsdato)}-${hentVerdi(fornavn)}-${index}`
                            }
                        />
                    );
                })}
        </VStack>
    );
};

type BarnProps = {
    barn: SøknadBarn;
    tiltaksperiode: Nullable<Periode>;
    personopplysninger?: Personopplysninger;
};

const Barn = ({ barn, tiltaksperiode, personopplysninger }: BarnProps) => {
    const {
        fornavn,
        mellomnavn,
        etternavn,
        fødselsdato,
        oppholderSegIEØSSpm,
        oppholdssted,
        kilde,
    } = barn;

    const navn = [fornavn, mellomnavn, etternavn]
        .map((navn) => sladdbarTekst(navn))
        .filter(Boolean)
        .join(' ');

    const fødselsdatoFormattert = formaterSladdbarDatotekst(fødselsdato);
    const fødselsdatoVerdi = hentVerdi(fødselsdato);

    const bleFødtITiltaksperioden =
        fødselsdatoVerdi && tiltaksperiode
            ? erDatoIPeriode(fødselsdatoVerdi, tiltaksperiode)
            : false;

    const fyller16dato = fødselsdatoVerdi ? finn16årsdag(fødselsdatoVerdi) : null;
    const fyller16ITiltaksperioden =
        fyller16dato && tiltaksperiode ? erDatoIPeriode(fyller16dato, tiltaksperiode) : false;

    const { fortrolig, strengtFortrolig, strengtFortroligUtland, dødsdato } =
        personopplysninger || {};

    const dødsdatoVerdi = hentVerdi(dødsdato);

    const dødeITiltaksperioden =
        dødsdatoVerdi && tiltaksperiode ? erDatoIPeriode(dødsdatoVerdi, tiltaksperiode) : false;

    return (
        <div>
            <BehandlingSaksopplysning navn={'Navn'} verdi={navn} />
            <BehandlingSaksopplysning
                navn={'Alder'}
                verdi={formaterSladdbarVerdi(fødselsdato, (dato) => `${alderFraDato(dato)} år`)}
            />
            {fyller16ITiltaksperioden && (
                <BehandlingSaksopplysning
                    navn={'Barnet fyller 16 år i tiltaksperioden'}
                    verdi={formaterDatotekst(nonNullish(fyller16dato))}
                    visVarsel
                />
            )}
            {bleFødtITiltaksperioden ? (
                <BehandlingSaksopplysning
                    navn={'Barnet ble født i tiltaksperioden'}
                    verdi={fødselsdatoFormattert}
                    visVarsel
                />
            ) : (
                <BehandlingSaksopplysning navn={'Fødselsdato'} verdi={fødselsdatoFormattert} />
            )}
            {dødeITiltaksperioden && (
                <BehandlingSaksopplysning
                    navn={'Barnet døde  i tiltaksperioden'}
                    verdi={formaterDatotekst(nonNullish(dødsdatoVerdi))}
                    visVarsel
                />
            )}
            {oppholdssted ? (
                <BehandlingSaksopplysning
                    navn={'Oppholdssted'}
                    verdi={oppholdsstedTekst[oppholdssted]}
                    visVarsel={oppholdssted === 'IKKE_EØS_LAND'}
                />
            ) : (
                <BehandlingSaksopplysning
                    navn={'Oppholder seg i Norge/EØS?'}
                    verdi={formaterSøknadsspørsmålSvar(oppholderSegIEØSSpm.svar)}
                    visVarsel={oppholderSegIEØSSpm.svar !== 'JA'}
                />
            )}
            <BehandlingSaksopplysning navn={'Kilde'} verdi={kilde} />

            {(fortrolig || strengtFortrolig || strengtFortroligUtland) && (
                <BehandlingSaksopplysning
                    navn={'Adressebeskyttelse'}
                    verdi={`Barnet har ${strengtFortrolig || strengtFortroligUtland ? 'strengt ' : ''}fortrolig adresse`}
                    visVarsel
                />
            )}
        </div>
    );
};
