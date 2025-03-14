import { BodyShort } from '@navikt/ds-react';
import { Fragment } from 'react';
import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { alderFraDato, finn16årsdag, formaterDatotekst } from '../../../../utils/date';
import { erDatoIPeriode } from '../../../../utils/periode';
import { hentTiltaksperiode } from '../../../../utils/behandling';
import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

import style from './SøknadOpplysningerBarn.module.css';

type Props = {
    behandling: FørstegangsbehandlingData;
    className?: string;
};

export const SøknadOpplysningerBarn = ({ behandling, className }: Props) => {
    const barn = behandling.søknad.barnetillegg;

    if (barn.length === 0) {
        return null;
    }

    const tiltaksperiode = hentTiltaksperiode(behandling);

    return (
        <div className={className}>
            <BodyShort>{'Barn:'}</BodyShort>
            {barn
                .toSorted((a, b) => (a.fødselsdato > b.fødselsdato ? 1 : -1))
                .map((barn) => {
                    const { fornavn, mellomnavn, etternavn, fødselsdato, oppholderSegIEØS, kilde } =
                        barn;

                    const navn = [fornavn, mellomnavn, etternavn].filter(Boolean).join(' ');

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
                                <div className={style.barn16varsel}>
                                    <BehandlingSaksopplysning
                                        navn={'Barnet fyller 16 år i tiltaksperioden'}
                                        verdi={formaterDatotekst(fyller16dato)}
                                    />
                                    <ExclamationmarkTriangleFillIcon />
                                </div>
                            )}
                            <BehandlingSaksopplysning
                                navn={'Fødselsdato'}
                                verdi={formaterDatotekst(fødselsdato)}
                            />
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
