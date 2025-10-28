import React from 'react';

import { Periode } from '~/types/Periode';
import { useConfig } from '~/context/ConfigContext';
import {
    BehandlingSaksopplysning,
    BehandlingSaksopplysningMedPeriode,
} from '../../behandling/saksopplysninger/BehandlingSaksopplysning';
import { formaterDatotekst, periodeTilFormatertDatotekst } from '~/utils/date';
import { SøknadOpplysningerPengestøtter } from '../../behandling/saksopplysninger/søknad/SøknadOpplysningerPengestøtter';
import { SøknadOpplysningerBarn } from '../../behandling/saksopplysninger/søknad/SøknadOpplysningerBarn';
import { Alert, Box, Heading, Link, VStack } from '@navikt/ds-react';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

import styles from './OppsummeringAvSøknad.module.css';
import { Søknad } from '~/types/Søknad';
import { Nullable } from '~/types/UtilTypes';

interface Props {
    /** Behandlingens tiltaksperiode, eller det som er på søknad hvis behandling er enda ikke opprettet (null ved papirsøknad dersom saksbehandler ikke har fyllt inn)*/
    tiltaksperiode: Nullable<Periode>;
    søknad: Søknad;
    medTittel?: boolean;
}

const OppsummeringAvSøknad = (props: Props) => {
    const { gosysUrl } = useConfig();

    const {
        tidsstempelHosOss,
        tiltak,
        kvp,
        intro,
        institusjon,
        etterlønn,
        sykepenger,
        antallVedlegg,
    } = props.søknad;

    return (
        <Box>
            {props.medTittel && (
                <Heading className={styles.header} size={'small'} level={'4'}>
                    Fra søknad
                </Heading>
            )}

            <VStack>
                <BehandlingSaksopplysning
                    navn={'Kravdato'}
                    verdi={formaterDatotekst(tidsstempelHosOss)}
                    spacing={true}
                />

                {tiltak && <BehandlingSaksopplysning navn={'Tiltak'} verdi={tiltak.typeNavn} />}
                {tiltak?.fraOgMed && tiltak.tilOgMed && (
                    <BehandlingSaksopplysning
                        navn={'Periode'}
                        verdi={periodeTilFormatertDatotekst({
                            fraOgMed: tiltak.fraOgMed,
                            tilOgMed: tiltak.tilOgMed,
                        })}
                        spacing={true}
                    />
                )}

                {kvp ? (
                    <div className={styles.soknadsopplysningVarsel}>
                        <BehandlingSaksopplysningMedPeriode navn={'KVP'} periode={kvp} />
                        <ExclamationmarkTriangleFillIcon />
                    </div>
                ) : (
                    <BehandlingSaksopplysningMedPeriode navn={'KVP'} periode={kvp} />
                )}
                {intro ? (
                    <div className={styles.soknadsopplysningVarsel}>
                        <BehandlingSaksopplysningMedPeriode navn={'Intro'} periode={intro} />
                        <ExclamationmarkTriangleFillIcon />
                    </div>
                ) : (
                    <BehandlingSaksopplysningMedPeriode navn={'Intro'} periode={intro} />
                )}
                {institusjon ? (
                    <div className={styles.soknadsopplysningVarsel}>
                        <BehandlingSaksopplysningMedPeriode
                            navn={'Institusjonsopphold'}
                            periode={institusjon}
                        />
                        <ExclamationmarkTriangleFillIcon />
                    </div>
                ) : (
                    <BehandlingSaksopplysningMedPeriode
                        navn={'Institusjonsopphold'}
                        periode={institusjon}
                    />
                )}
                {etterlønn ? (
                    <div className={styles.soknadsopplysningVarsel}>
                        <BehandlingSaksopplysning
                            navn={'Etterlønn'}
                            verdi={etterlønn ? 'Ja' : 'Nei'}
                        />
                        <ExclamationmarkTriangleFillIcon />
                    </div>
                ) : (
                    <BehandlingSaksopplysning navn={'Etterlønn'} verdi={etterlønn ? 'Ja' : 'Nei'} />
                )}
                {sykepenger ? (
                    <div className={styles.soknadsopplysningVarsel}>
                        <BehandlingSaksopplysningMedPeriode
                            navn={'Mottar sykepenger og fortsatt sykmeldt'}
                            periode={sykepenger}
                            spacing={true}
                        />
                        <ExclamationmarkTriangleFillIcon />
                    </div>
                ) : (
                    <BehandlingSaksopplysningMedPeriode
                        navn={'Mottar sykepenger og fortsatt sykmeldt'}
                        periode={sykepenger}
                        spacing={true}
                    />
                )}

                <SøknadOpplysningerPengestøtter pengestøtter={props.søknad} />
                {/* TODO - kan vi se om vi kan støtte underkomponenten uten tiltaksperiode? Denne kan være viktig for papirsøknad @Henrik */}
                {props.tiltaksperiode && (
                    <SøknadOpplysningerBarn
                        tiltaksperiode={props.tiltaksperiode}
                        søknad={props.søknad}
                    />
                )}

                <BehandlingSaksopplysning
                    navn={'Vedlegg'}
                    verdi={antallVedlegg > 0 ? 'Ja' : 'Nei'}
                />
                {antallVedlegg > 0 && (
                    <Alert variant={'warning'} inline={true} size={'small'}>
                        {'Sjekk vedlegg i '}
                        <Link href={gosysUrl}>{'gosys'}</Link>
                    </Alert>
                )}
            </VStack>
        </Box>
    );
};

export default OppsummeringAvSøknad;
