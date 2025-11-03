import React from 'react';
import styles from '../../../oppsummeringer/oppsummeringAvSøknad/OppsummeringAvSøknad.module.css';
import {
    BehandlingSaksopplysning,
    BehandlingSaksopplysningMedPeriodeSpm,
} from '../BehandlingSaksopplysning';
import { BodyShort } from '@navikt/ds-react';
import { formaterDatotekst } from '~/utils/date';
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

    const mottarPengestøtte =
        alderspensjon?.svar === 'JA' ||
        gjenlevendepensjon?.svar === 'JA' ||
        supplerendeStønadAlder?.svar === 'JA' ||
        supplerendeStønadFlyktning?.svar === 'JA' ||
        trygdOgPensjon?.svar === 'JA' ||
        jobbsjansen?.svar === 'JA';
    console.log(pengestøtter);

    return (
        <div className={className}>
            {mottarPengestøtte ? (
                <>
                    <BodyShort>{'Pengestøtter'}</BodyShort>
                    {alderspensjon.svar === 'JA' && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysning
                                navn={'Alderspensjon fra'}
                                verdi={formaterDatotekst(alderspensjon.fraDato)}
                                visVarsel
                            />
                        </div>
                    )}
                    {gjenlevendepensjon.svar === 'JA' && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriodeSpm
                                navn={'Gjenlevende ektefelle'}
                                periodeSpm={gjenlevendepensjon}
                                visVarsel
                            />
                        </div>
                    )}
                    {supplerendeStønadAlder.svar === 'JA' && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriodeSpm
                                navn={'Supplerende stønad alder'}
                                periodeSpm={supplerendeStønadAlder}
                                visVarsel
                            />
                        </div>
                    )}
                    {supplerendeStønadFlyktning.svar === 'JA' && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriodeSpm
                                navn={'Supplerende stønad ufør'}
                                periodeSpm={supplerendeStønadFlyktning}
                                visVarsel
                            />
                        </div>
                    )}
                    {trygdOgPensjon.svar === 'JA' && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriodeSpm
                                navn={'Annen trygd eller pensjon'}
                                periodeSpm={trygdOgPensjon}
                                visVarsel
                            />
                        </div>
                    )}
                    {jobbsjansen.svar === 'JA' && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriodeSpm
                                navn={'Jobbsjansen'}
                                periodeSpm={jobbsjansen}
                                visVarsel
                            />
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
