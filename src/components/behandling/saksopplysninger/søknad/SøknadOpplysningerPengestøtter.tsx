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

    // Vi må markere tydelig når søker mottar pengestøtte eller har unnlatt å besvare spørsmål om pengestøtte
    const jaEllerIkkeBesvart = (svar: string) => svar === 'JA' || svar === 'IKKE_BESVART';

    const potensieltMottarPengestøtte =
        jaEllerIkkeBesvart(alderspensjon.svar) ||
        jaEllerIkkeBesvart(gjenlevendepensjon.svar) ||
        jaEllerIkkeBesvart(supplerendeStønadAlder.svar) ||
        jaEllerIkkeBesvart(supplerendeStønadFlyktning.svar) ||
        jaEllerIkkeBesvart(trygdOgPensjon.svar) ||
        jaEllerIkkeBesvart(jobbsjansen.svar);

    return (
        <div className={className}>
            {potensieltMottarPengestøtte ? (
                <>
                    <BodyShort>{'Pengestøtter'}</BodyShort>
                    {jaEllerIkkeBesvart(alderspensjon.svar) && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysning
                                navn={'Alderspensjon fra'}
                                verdi={
                                    alderspensjon.svar === 'JA'
                                        ? formaterDatotekst(alderspensjon.fraDato)
                                        : alderspensjon.svar
                                }
                                visVarsel
                            />
                        </div>
                    )}
                    {jaEllerIkkeBesvart(gjenlevendepensjon.svar) && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriodeSpm
                                navn={'Gjenlevende ektefelle'}
                                periodeSpm={gjenlevendepensjon}
                                visVarsel
                            />
                        </div>
                    )}
                    {jaEllerIkkeBesvart(supplerendeStønadAlder.svar) && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriodeSpm
                                navn={'Supplerende stønad alder'}
                                periodeSpm={supplerendeStønadAlder}
                                visVarsel
                            />
                        </div>
                    )}
                    {jaEllerIkkeBesvart(supplerendeStønadFlyktning.svar) && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriodeSpm
                                navn={'Supplerende stønad ufør'}
                                periodeSpm={supplerendeStønadFlyktning}
                                visVarsel
                            />
                        </div>
                    )}
                    {jaEllerIkkeBesvart(trygdOgPensjon.svar) && (
                        <div className={styles.soknadsopplysningVarsel}>
                            <BehandlingSaksopplysningMedPeriodeSpm
                                navn={'Annen trygd eller pensjon'}
                                periodeSpm={trygdOgPensjon}
                                visVarsel
                            />
                        </div>
                    )}
                    {jaEllerIkkeBesvart(jobbsjansen.svar) && (
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
