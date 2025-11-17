import React from 'react';
import {
    BehandlingSaksopplysning,
    BehandlingSaksopplysningMedPeriodeSpm,
} from '../BehandlingSaksopplysning';
import { BodyShort } from '@navikt/ds-react';
import { formaterDatotekst } from '~/utils/date';
import { SpørsmålsbesvarelserPengestøtter } from '~/types/Søknad';

type Props = {
    className?: string;
    pengestøtter: SpørsmålsbesvarelserPengestøtter;
};

export const SøknadOpplysningerSvar = ({ className, pengestøtter }: Props) => {
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
                        <BehandlingSaksopplysning
                            navn={'Alderspensjon fra'}
                            verdi={
                                alderspensjon.svar === 'JA'
                                    ? formaterDatotekst(alderspensjon.fraOgMed)
                                    : alderspensjon.svar
                            }
                            visVarsel
                        />
                    )}
                    {jaEllerIkkeBesvart(gjenlevendepensjon.svar) && (
                        <BehandlingSaksopplysningMedPeriodeSpm
                            navn={'Gjenlevende ektefelle'}
                            periodeSpm={gjenlevendepensjon}
                            visVarsel
                        />
                    )}
                    {jaEllerIkkeBesvart(supplerendeStønadAlder.svar) && (
                        <BehandlingSaksopplysningMedPeriodeSpm
                            navn={'Supplerende stønad alder'}
                            periodeSpm={supplerendeStønadAlder}
                            visVarsel
                        />
                    )}
                    {jaEllerIkkeBesvart(supplerendeStønadFlyktning.svar) && (
                        <BehandlingSaksopplysningMedPeriodeSpm
                            navn={'Supplerende stønad ufør'}
                            periodeSpm={supplerendeStønadFlyktning}
                            visVarsel
                        />
                    )}
                    {jaEllerIkkeBesvart(trygdOgPensjon.svar) && (
                        <BehandlingSaksopplysningMedPeriodeSpm
                            navn={'Annen trygd eller pensjon'}
                            periodeSpm={trygdOgPensjon}
                            visVarsel
                        />
                    )}
                    {jaEllerIkkeBesvart(jobbsjansen.svar) && (
                        <BehandlingSaksopplysningMedPeriodeSpm
                            navn={'Jobbsjansen'}
                            periodeSpm={jobbsjansen}
                            visVarsel
                        />
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
