import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';
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

type Props = {
    førstegangsbehandling: FørstegangsbehandlingData;
};

export const BehandlingSøknadOpplysninger = ({ førstegangsbehandling }: Props) => {
    const { søknad } = førstegangsbehandling;

    const {
        tidsstempelHosOss,
        tiltak: tiltakRaw,
        kvp,
        intro,
        institusjon,
        etterlønn,
        sykepenger,
        barnetillegg,
        antallVedlegg,
    } = søknad;

    const tiltak = singleOrFirst(tiltakRaw);

    return (
        <>
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
            <SøknadOpplysningerBarn barn={barnetillegg} className={style.spacing} />

            <BehandlingSaksopplysning navn={'Vedlegg'} verdi={antallVedlegg > 0 ? 'Ja' : 'Nei'} />
            {antallVedlegg > 0 && (
                <Alert variant={'warning'} inline={true} size={'small'}>
                    {'Sjekk vedlegg i '}
                    <Link href={'#gosys.com'}>{'gosys'}</Link>
                </Alert>
            )}
        </>
    );
};
