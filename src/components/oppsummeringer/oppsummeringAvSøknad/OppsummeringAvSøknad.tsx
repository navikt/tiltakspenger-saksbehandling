import React from 'react';
import { SøknadForBehandlingProps } from '../../../types/SøknadTypes';
import { Periode } from '../../../types/Periode';
import { useConfig } from '../../../context/ConfigContext';
import { singleOrFirst } from '../../../utils/array';
import {
    BehandlingSaksopplysning,
    BehandlingSaksopplysningMedPeriode,
} from '../../behandling/saksopplysninger/BehandlingSaksopplysning';
import { formaterDatotekst, periodeTilFormatertDatotekst } from '../../../utils/date';
import { SøknadOpplysningerPengestøtter } from '../../behandling/saksopplysninger/søknad/SøknadOpplysningerPengestøtter';
import { SøknadOpplysningerBarn } from '../../behandling/saksopplysninger/søknad/SøknadOpplysningerBarn';
import { Alert, Box, Heading, Link, VStack } from '@navikt/ds-react';

import styles from './OppsummeringAvSøknad.module.css';

interface Props {
    /** Behandlingens tiltaksperiode, eller det som er på søknad hvis behandling er enda ikke opprettet */
    tiltaksperiode: Periode;
    søknad: SøknadForBehandlingProps;
    medTittel?: boolean;
}

const OppsummeringAvSøknad = (props: Props) => {
    const { gosysUrl } = useConfig();

    const {
        tidsstempelHosOss,
        tiltak: tiltakRaw,
        kvp,
        intro,
        institusjon,
        etterlønn,
        sykepenger,
        antallVedlegg,
        visVedlegg,
    } = props.søknad;

    const tiltak = singleOrFirst(tiltakRaw);

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

                <BehandlingSaksopplysning navn={'Tiltak'} verdi={tiltak.typeNavn} />
                <BehandlingSaksopplysning
                    navn={'Periode'}
                    verdi={periodeTilFormatertDatotekst({
                        fraOgMed: tiltak.fraOgMed,
                        tilOgMed: tiltak.tilOgMed,
                    })}
                    spacing={true}
                />

                <BehandlingSaksopplysningMedPeriode navn={'KVP'} periode={kvp} />
                <BehandlingSaksopplysningMedPeriode navn={'Intro'} periode={intro} />
                <BehandlingSaksopplysningMedPeriode
                    navn={'Institusjonsopphold'}
                    periode={institusjon}
                />
                <BehandlingSaksopplysning navn={'Etterlønn'} verdi={etterlønn ? 'Ja' : 'Nei'} />
                <BehandlingSaksopplysningMedPeriode
                    navn={'Mottar sykepenger og fortsatt sykmeldt'}
                    periode={sykepenger}
                    spacing={true}
                />

                <SøknadOpplysningerPengestøtter pengestøtter={props.søknad} />
                <SøknadOpplysningerBarn
                    tiltaksperiode={props.tiltaksperiode}
                    søknad={props.søknad}
                />

                {visVedlegg && (
                    <>
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
                    </>
                )}
            </VStack>
        </Box>
    );
};

export default OppsummeringAvSøknad;
