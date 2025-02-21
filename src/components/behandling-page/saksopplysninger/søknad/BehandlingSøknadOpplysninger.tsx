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
        alderspensjon,
        gjenlevendepensjon,
        supplerendeStønadAlder,
        supplerendeStønadFlyktning,
        jobbsjansen,
        trygdOgPensjon,
    } = søknad;

    const pengestøtter = Object.entries({
        alderspensjon,
        gjenlevendepensjon,
        supplerendeStønadAlder,
        supplerendeStønadFlyktning,
        jobbsjansen,
        trygdOgPensjon,
    }).reduce<OpplysningMedDatoerProps[]>(
        (acc, [navn, verdi]) => (verdi ? [...acc, { navn, periodeEllerDato: verdi }] : acc),
        [],
    );

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

            {pengestøtter.length > 0 ? (
                pengestøtter.map((pengestøtte) => (
                    <OpplysningMedDatoer
                        navn={pengestøtte.navn}
                        periodeEllerDato={pengestøtte.periodeEllerDato}
                    />
                ))
            ) : (
                <BehandlingSaksopplysning
                    navn={'Mottar pengestøtte'}
                    verdi={'Nei'}
                    spacing={true}
                />
            )}

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
                        ? periodeEllerDato
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
