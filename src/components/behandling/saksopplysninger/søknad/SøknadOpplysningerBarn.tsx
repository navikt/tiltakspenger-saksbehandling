import { BodyShort, HStack, Loader, VStack } from '@navikt/ds-react';
import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { alderFraDato, finn16årsdag, formaterDatotekst } from '~/utils/date';
import { erDatoIPeriode } from '~/utils/periode';
import { Periode } from '~/types/Periode';
import { Søknad } from '~/types/Søknad';
import { useHentPersonopplysningerBarn } from '~/components/papirsøknad/barnetillegg/useHentPersonopplysningerBarn';
import { useSak } from '~/context/sak/SakContext';
import { Personopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';

type Props = {
    tiltaksperiode: Periode;
    søknad: Søknad;
    personopplysningerBarn?: Personopplysninger[];
};

export const SøknadOpplysningerBarn = ({ tiltaksperiode, søknad }: Props) => {
    const { sak } = useSak();
    const hentPersonopplysningerBarn = useHentPersonopplysningerBarn(
        sak.sakId,
        søknad.barnetillegg.length > 0,
    );

    return (
        <VStack>
            {hentPersonopplysningerBarn.isLoading && (
                <HStack gap="2" align="center">
                    <Loader size="small" title="Henter skjermingsinformasjon for barn..." />
                    <BodyShort size="small">Henter skjermingsinformasjon for barn...</BodyShort>
                </HStack>
            )}
            <BodyShort spacing={true}>{'Barn:'}</BodyShort>
            {søknad.barnetillegg.length > 0 ? (
                <MedBarn
                    tiltaksperiode={tiltaksperiode}
                    søknad={søknad}
                    personopplysningerBarn={hentPersonopplysningerBarn.data}
                />
            ) : (
                <UtenBarn />
            )}
        </VStack>
    );
};

const MedBarn = ({ tiltaksperiode, søknad, personopplysningerBarn }: Props) => {
    return (
        <VStack gap={'4'}>
            {søknad.barnetillegg
                .toSorted((a, b) => (a.fødselsdato > b.fødselsdato ? 1 : -1))
                .map((barn) => {
                    const {
                        fornavn,
                        mellomnavn,
                        etternavn,
                        fødselsdato,
                        oppholderSegIEØSSpm,
                        kilde,
                        fnr,
                    } = barn;

                    const navn = [fornavn, mellomnavn, etternavn].filter(Boolean).join(' ');
                    const fødselsdatoFormattert = formaterDatotekst(fødselsdato);

                    const bleFødtITiltaksperioden = erDatoIPeriode(fødselsdato, tiltaksperiode);

                    const fyller16dato = finn16årsdag(fødselsdato);
                    const fyller16ITiltaksperioden = erDatoIPeriode(fyller16dato, tiltaksperiode);

                    const personopplysninger = personopplysningerBarn?.find((p) => p.fnr === fnr);
                    const { fortrolig, strengtFortrolig, dødsdato } = personopplysninger || {};
                    const dødeITiltaksperioden = dødsdato
                        ? erDatoIPeriode(dødsdato, tiltaksperiode)
                        : false;

                    return (
                        <div key={`${fødselsdato}-${navn}`}>
                            <BehandlingSaksopplysning navn={'Navn'} verdi={navn} />
                            <BehandlingSaksopplysning
                                navn={'Alder'}
                                verdi={`${alderFraDato(fødselsdato)} år`}
                            />
                            {fyller16ITiltaksperioden && (
                                <BehandlingSaksopplysning
                                    navn={'Barnet fyller 16 år i tiltaksperioden'}
                                    verdi={formaterDatotekst(fyller16dato)}
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
                                <BehandlingSaksopplysning
                                    navn={'Fødselsdato'}
                                    verdi={fødselsdatoFormattert}
                                />
                            )}
                            {dødeITiltaksperioden && (
                                <BehandlingSaksopplysning
                                    navn={'Barnet døde  i tiltaksperioden'}
                                    verdi={formaterDatotekst(dødsdato!)}
                                    visVarsel
                                />
                            )}
                            <BehandlingSaksopplysning
                                navn={'Oppholder seg i Norge/EØS?'}
                                verdi={oppholderSegIEØSSpm.svar}
                                visVarsel={oppholderSegIEØSSpm.svar !== 'JA'}
                            />
                            <BehandlingSaksopplysning navn={'Kilde'} verdi={kilde} />

                            {(fortrolig || strengtFortrolig) && (
                                <BehandlingSaksopplysning
                                    navn={'Adressebeskyttelse'}
                                    verdi={`Barnet har ${strengtFortrolig ? 'strengt ' : ''}fortrolig adresse`}
                                    visVarsel
                                />
                            )}
                        </div>
                    );
                })}
        </VStack>
    );
};

const UtenBarn = () => {
    return <BodyShort size={'small'}>{'Har ikke søkt om barnetillegg'}</BodyShort>;
};
