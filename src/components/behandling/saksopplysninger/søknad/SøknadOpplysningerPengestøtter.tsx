import {
    BehandlingSaksopplysning,
    BehandlingSaksopplysningMedPeriode,
} from '../BehandlingSaksopplysning';
import { BodyShort } from '@navikt/ds-react';
import { formaterDatotekst } from '../../../../utils/date';
import styles from '../../../oppsummeringer/oppsummeringAvSøknad/OppsummeringAvSøknad.module.css';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import React from 'react';
import { SøknadPengestøtter } from '~/types/Søknad';

type Props = {
    className?: string;
    pengestøtter: SøknadPengestøtter;
};

export const SøknadOpplysningerPengestøtter = ({ className, pengestøtter }: Props) => {
    const {
        alderspensjon,
        gjenlevendepensjon,
        supplerendeStønadAlder,
        supplerendeStønadFlyktning,
        trygdOgPensjon,
        jobbsjansen,
    } = pengestøtter;

    const antallPengestøtter = [
        alderspensjon,
        gjenlevendepensjon,
        supplerendeStønadAlder,
        supplerendeStønadFlyktning,
        trygdOgPensjon,
        jobbsjansen,
    ].filter(Boolean).length;

    return (
        <div className={className}>
            {antallPengestøtter > 0 ? (
                <>
                    <BodyShort>{'Pengestøtter'}</BodyShort>
                    {alderspensjon && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysning
                                navn={'Alderspensjon fra'}
                                verdi={formaterDatotekst(alderspensjon)}
                            />
                            <ExclamationmarkTriangleFillIcon />
                        </div>
                    )}
                    {gjenlevendepensjon && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriode
                                navn={'Gjenlevende ektefelle'}
                                periode={gjenlevendepensjon}
                            />
                            <ExclamationmarkTriangleFillIcon />
                        </div>
                    )}
                    {supplerendeStønadAlder && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriode
                                navn={'Supplerende stønad alder'}
                                periode={supplerendeStønadAlder}
                            />
                            <ExclamationmarkTriangleFillIcon />
                        </div>
                    )}
                    {supplerendeStønadFlyktning && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriode
                                navn={'Supplerende stønad ufør'}
                                periode={supplerendeStønadFlyktning}
                            />
                            <ExclamationmarkTriangleFillIcon />
                        </div>
                    )}
                    {trygdOgPensjon && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriode
                                navn={'Annen trygd eller pensjon'}
                                periode={trygdOgPensjon}
                            />
                            <ExclamationmarkTriangleFillIcon />
                        </div>
                    )}
                    {jobbsjansen && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriode
                                navn={'Jobbsjansen'}
                                periode={jobbsjansen}
                            />
                            <ExclamationmarkTriangleFillIcon />
                        </div>
                    )}
                </>
            ) : (
                <BehandlingSaksopplysning
                    navn={'Mottar pengestøtte'}
                    verdi={'Nei'}
                    spacing={true}
                />
            )}
        </div>
    );
};
