import { SøknadPengestøtter } from '../../../../types/SøknadTypes';
import {
    BehandlingSaksopplysning,
    BehandlingSaksopplysningMedPeriode,
} from '../BehandlingSaksopplysning';
import { BodyShort } from '@navikt/ds-react';
import { formaterDatotekst } from '../../../../utils/date';

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
                        <BehandlingSaksopplysning
                            navn={'Alderspensjon fra'}
                            verdi={formaterDatotekst(alderspensjon)}
                        />
                    )}
                    {gjenlevendepensjon && (
                        <BehandlingSaksopplysningMedPeriode
                            navn={'Gjenlevende ektefelle'}
                            periode={gjenlevendepensjon}
                        />
                    )}
                    {supplerendeStønadAlder && (
                        <BehandlingSaksopplysningMedPeriode
                            navn={'Supplerende stønad alder'}
                            periode={supplerendeStønadAlder}
                        />
                    )}
                    {supplerendeStønadFlyktning && (
                        <BehandlingSaksopplysningMedPeriode
                            navn={'Supplerende stønad ufør'}
                            periode={supplerendeStønadFlyktning}
                        />
                    )}
                    {trygdOgPensjon && (
                        <BehandlingSaksopplysningMedPeriode
                            navn={'Annen trygd eller pensjon'}
                            periode={trygdOgPensjon}
                        />
                    )}
                    {jobbsjansen && (
                        <BehandlingSaksopplysningMedPeriode
                            navn={'Jobbsjansen'}
                            periode={jobbsjansen}
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
