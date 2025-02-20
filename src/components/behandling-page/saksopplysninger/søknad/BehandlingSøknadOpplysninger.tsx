import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';
import { formaterDatotekst, periodeTilFormatertDatotekst } from '../../../../utils/date';
import { Alert, BodyShort, Link } from '@navikt/ds-react';
import { Fragment } from 'react';
import { Periode } from '../../../../types/Periode';
import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';

type Props = {
    førstegangsbehandling: FørstegangsbehandlingData;
};

export const BehandlingSøknadOpplysninger = ({ førstegangsbehandling }: Props) => {
    const { søknad } = førstegangsbehandling;

    const {
        tidsstempelHosOss,
        tiltak,
        kvp,
        intro,
        institusjon,
        etterlønn,
        sykepenger,
        barnetillegg,
        antallVedlegg,
    } = søknad;

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
            <OpplysningMedPeriode navn={'KVP'} periode={kvp} />
            <OpplysningMedPeriode navn={'Intro'} periode={intro} />
            <OpplysningMedPeriode navn={'Institusjonsopphold'} periode={institusjon} />
            <BehandlingSaksopplysning navn={'Etterlønn'} verdi={etterlønn ? 'Ja' : 'Nei'} />
            <OpplysningMedPeriode
                navn={'Mottar sykepenger og fortsatt sykmeldt'}
                periode={sykepenger}
            />
            <BehandlingSaksopplysning navn={'Mottar pengestøtte'} verdi={'Tja?'} spacing={true} />
            {barnetillegg.length > 0 && (
                <>
                    <BodyShort>{'Barn:'}</BodyShort>
                    {barnetillegg.map((barn, index) => (
                        <Fragment key={`${barn.fødselsdato}-${index}`}>
                            <BehandlingSaksopplysning
                                navn={'Navn'}
                                verdi={[barn.fornavn, barn.mellomnavn, barn.etternavn]
                                    .filter(Boolean)
                                    .join(' ')}
                            />
                            <BehandlingSaksopplysning
                                navn={'Fødselsdato'}
                                verdi={barn.fødselsdato}
                            />
                            <BehandlingSaksopplysning
                                navn={'Oppholder seg i Norge/EØS?'}
                                verdi={barn.oppholderSegIEØS ? 'Ja' : 'Nei'}
                                spacing={true}
                            />
                        </Fragment>
                    ))}
                </>
            )}
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

const OpplysningMedPeriode = ({
    navn,
    periode,
    spacing,
}: {
    navn: string;
    periode?: Periode | null;
    spacing?: boolean;
}) => {
    return periode ? (
        <>
            <BehandlingSaksopplysning navn={navn} verdi={'Ja'} />
            <BehandlingSaksopplysning
                navn={navn}
                verdi={periodeTilFormatertDatotekst({
                    fraOgMed: periode.fraOgMed,
                    tilOgMed: periode.tilOgMed,
                })}
                spacing={spacing}
            />
        </>
    ) : (
        <BehandlingSaksopplysning navn={navn} verdi={'Nei'} spacing={spacing} />
    );
};
