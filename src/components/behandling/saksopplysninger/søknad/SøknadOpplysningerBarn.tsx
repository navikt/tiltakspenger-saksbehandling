import { BodyShort } from '@navikt/ds-react';
import { Fragment } from 'react';
import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { alderFraDato, finn16årsdag, formaterDatotekst } from '../../../../utils/date';
import { erDatoIPeriode } from '../../../../utils/periode';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

import style from './SøknadOpplysningerBarn.module.css';
import { SøknadForBehandlingProps } from '../../../../types/SøknadTypes';
import { Periode } from '../../../../types/Periode';

type Props = {
    tiltaksperiode: Periode;
    søknad: SøknadForBehandlingProps;
    className?: string;
};

export const SøknadOpplysningerBarn = ({ tiltaksperiode, søknad, className }: Props) => {
    const barn = søknad.barnetillegg;

    if (barn.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            <BodyShort>{'Barn:'}</BodyShort>
            {barn
                .toSorted((a, b) => (a.fødselsdato > b.fødselsdato ? 1 : -1))
                .map((barn) => {
                    const { fornavn, mellomnavn, etternavn, fødselsdato, oppholderSegIEØS, kilde } =
                        barn;

                    const navn = [fornavn, mellomnavn, etternavn].filter(Boolean).join(' ');
                    const fødselsdatoFormattert = formaterDatotekst(fødselsdato);

                    const bleFødtITiltaksperioden = erDatoIPeriode(fødselsdato, tiltaksperiode);

                    const fyller16dato = finn16årsdag(fødselsdato);
                    const fyller16ITiltaksperioden = erDatoIPeriode(fyller16dato, tiltaksperiode);

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
                                verdi={oppholderSegIEØS ? 'Ja' : 'Nei'}
                            />
                            <BehandlingSaksopplysning navn={'Kilde'} verdi={kilde} spacing={true} />
                        </Fragment>
                    );
                })}
        </div>
    );
};
