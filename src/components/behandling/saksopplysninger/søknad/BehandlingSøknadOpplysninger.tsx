import { formaterDatotekst, periodeTilFormatertDatotekst } from '../../../../utils/date';
import { Alert, Link } from '@navikt/ds-react';
import {
    BehandlingSaksopplysning,
    BehandlingSaksopplysningMedPeriode,
} from '../BehandlingSaksopplysning';
import { singleOrFirst } from '../../../../utils/array';
import { SøknadOpplysningerBarn } from './SøknadOpplysningerBarn';
import { SøknadOpplysningerPengestøtter } from './SøknadOpplysningerPengestøtter';

import style from './BehandlingSøknadOpplysninger.module.css';
import { useConfig } from '../../../../context/ConfigContext';
import { Periode } from '../../../../types/Periode';
import { SøknadForBehandlingProps } from '../../../../types/SøknadTypes';

type Props = {
    tiltaksperiode: Periode;
    søknad: SøknadForBehandlingProps;
};

export const BehandlingSøknadOpplysninger = ({ tiltaksperiode, søknad }: Props) => {
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
    } = søknad;

    const tiltak = singleOrFirst(tiltakRaw);

    return (
        <div>
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

            <SøknadOpplysningerPengestøtter pengestøtter={søknad} className={style.spacing} />
            <SøknadOpplysningerBarn
                tiltaksperiode={tiltaksperiode}
                søknad={søknad}
                className={style.spacing}
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
        </div>
    );
};
