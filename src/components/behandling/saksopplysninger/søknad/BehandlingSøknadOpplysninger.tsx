import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';
import { formaterDatotekst, periodeTilFormatertDatotekst } from '../../../../utils/date';
import { Alert, Link } from '@navikt/ds-react';
import { Periode } from '../../../../types/Periode';
import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { singleOrFirst } from '../../../../utils/array';
import { SøknadOpplysningerBarn } from './barn/SøknadOpplysningerBarn';

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
            <OpplysningMedDatoer navn={'KVP'} periodeEllerDato={kvp} />
            <OpplysningMedDatoer navn={'Intro'} periodeEllerDato={intro} />
            <OpplysningMedDatoer navn={'Institusjonsopphold'} periodeEllerDato={institusjon} />
            <BehandlingSaksopplysning navn={'Etterlønn'} verdi={etterlønn ? 'Ja' : 'Nei'} />
            <OpplysningMedDatoer
                navn={'Mottar sykepenger og fortsatt sykmeldt'}
                periodeEllerDato={sykepenger}
            />

            {/*{pengestøtter.length > 0 ? (*/}
            {/*    pengestøtter.map((pengestøtte) => (*/}
            {/*        <OpplysningMedDatoer*/}
            {/*            navn={pengestøtte.navn}*/}
            {/*            periodeEllerDato={pengestøtte.periodeEllerDato}*/}
            {/*            key={pengestøtte.navn}*/}
            {/*        />*/}
            {/*    ))*/}
            {/*) : (*/}
            {/*    <BehandlingSaksopplysning*/}
            {/*        navn={'Mottar pengestøtte'}*/}
            {/*        verdi={'Nei'}*/}
            {/*        spacing={true}*/}
            {/*    />*/}
            {/*)}*/}

            <SøknadOpplysningerBarn barn={barnetillegg} className={style.barn} />

            <BehandlingSaksopplysning
                navn={'Vedlegg'}
                verdi={antallVedlegg > 0 ? 'Ja' : 'Nei'}
                spacing={true}
            />
            {antallVedlegg > 0 && (
                <Alert variant={'warning'} inline={true} size={'small'}>
                    {'Sjekk vedlegg i '}
                    <Link href={'#gosys.com'}>{'gosys'}</Link>
                </Alert>
            )}
        </>
    );
};

type OpplysningMedDatoerProps = {
    navn: string;
    periodeEllerDato?: Periode | string | null;
    spacing?: boolean;
};

const OpplysningMedDatoer = ({ navn, periodeEllerDato, spacing }: OpplysningMedDatoerProps) => {
    return periodeEllerDato ? (
        <>
            <BehandlingSaksopplysning navn={navn} verdi={'Ja'} />
            <BehandlingSaksopplysning
                navn={navn}
                verdi={
                    typeof periodeEllerDato === 'string'
                        ? formaterDatotekst(periodeEllerDato)
                        : periodeTilFormatertDatotekst({
                              fraOgMed: periodeEllerDato.fraOgMed,
                              tilOgMed: periodeEllerDato.tilOgMed,
                          })
                }
                spacing={spacing}
            />
        </>
    ) : (
        <BehandlingSaksopplysning navn={navn} verdi={'Nei'} spacing={spacing} />
    );
};
