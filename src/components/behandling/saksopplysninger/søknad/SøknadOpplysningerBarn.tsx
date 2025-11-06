import { Alert, BodyShort, HStack, Loader, VStack } from '@navikt/ds-react';
import { Fragment } from 'react';
import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { alderFraDato, finn16årsdag, formaterDatotekst } from '~/utils/date';
import { erDatoIPeriode } from '~/utils/periode';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Periode } from '~/types/Periode';

import style from './SøknadOpplysningerBarn.module.css';
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
        <VStack style={{ marginBottom: '1rem' }}>
            {hentPersonopplysningerBarn.isLoading && (
                <HStack gap="2" align="center">
                    <Loader size="small" title="Henter skjermingsinformasjon for barn..." />
                    <BodyShort size="small">Henter skjermingsinformasjon for barn...</BodyShort>
                </HStack>
            )}
            <BodyShort>{'Barn:'}</BodyShort>
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
    return søknad.barnetillegg
        .toSorted((a, b) => (a.fødselsdato > b.fødselsdato ? 1 : -1))
        .map((barn) => {
            const { fornavn, mellomnavn, etternavn, fødselsdato, oppholderSegIEØSSpm, kilde, fnr } =
                barn;

            const navn = [fornavn, mellomnavn, etternavn].filter(Boolean).join(' ');
            const fødselsdatoFormattert = formaterDatotekst(fødselsdato);

            const bleFødtITiltaksperioden = erDatoIPeriode(fødselsdato, tiltaksperiode);

            const fyller16dato = finn16årsdag(fødselsdato);
            const fyller16ITiltaksperioden = erDatoIPeriode(fyller16dato, tiltaksperiode);

            const skjermingsInfo = personopplysningerBarn?.find((p) => p.fnr === fnr);

            return (
                <Fragment key={`${fødselsdato}-${navn}`}>
                    <BehandlingSaksopplysning navn={'Navn'} verdi={navn} />
                    <BehandlingSaksopplysning
                        navn={'Alder'}
                        verdi={`${alderFraDato(fødselsdato)} år`}
                    />
                    {fyller16ITiltaksperioden && (
                        <div className={style.alderVarsel}>
                            <BehandlingSaksopplysning
                                navn={'Barnet fyller 16 år i tiltaksperioden'}
                                verdi={formaterDatotekst(fyller16dato)}
                            />
                            <ExclamationmarkTriangleFillIcon />
                        </div>
                    )}
                    {bleFødtITiltaksperioden ? (
                        <div className={style.alderVarsel}>
                            <BehandlingSaksopplysning
                                navn={'Barnet ble født i tiltaksperioden'}
                                verdi={fødselsdatoFormattert}
                            />
                            <ExclamationmarkTriangleFillIcon />
                        </div>
                    ) : (
                        <BehandlingSaksopplysning
                            navn={'Fødselsdato'}
                            verdi={fødselsdatoFormattert}
                        />
                    )}
                    <BehandlingSaksopplysning
                        navn={'Oppholder seg i Norge/EØS?'}
                        verdi={oppholderSegIEØSSpm.svar}
                        visVarsel={oppholderSegIEØSSpm.svar !== 'JA'}
                    />
                    <BehandlingSaksopplysning navn={'Kilde'} verdi={kilde} />

                    {(skjermingsInfo?.fortrolig || skjermingsInfo?.strengtFortrolig) && (
                        <Alert size="small" variant="error">
                            Barnet har {skjermingsInfo?.strengtFortrolig ? 'strengt ' : ''}fortrolig
                            adresse
                        </Alert>
                    )}
                </Fragment>
            );
        });
};

const UtenBarn = () => {
    return <BodyShort size={'small'}>{'Har ikke søkt om barnetillegg'}</BodyShort>;
};
