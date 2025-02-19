import { Alert, BodyShort, Heading, Link } from '@navikt/ds-react';
import { alderFraDato, formaterDatotekst, periodeTilFormatertDatotekst } from '../../../utils/date';
import { Fragment, ReactNode } from 'react';
import { classNames } from '../../../utils/classNames';
import { Periode } from '../../../types/Periode';
import { useBehandling } from '../BehandlingContext';
import { Separator } from '../../separator/Separator';
import { SaksbehandlerRolle } from '../../../types/Saksbehandler';
import { BehandlingOppdaterSaksopplysninger } from './oppdater-saksopplysninger/BehandlingOppdaterSaksopplysninger';

import style from './BehandlingSaksopplysninger.module.css';

export const BehandlingSaksopplysninger = () => {
    const { behandling, rolleForBehandling } = useBehandling();

    const { saksopplysninger, søknad } = behandling;

    const { tiltaksdeltagelse, fødselsdato } = saksopplysninger;
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

    const {
        typeNavn,
        deltagelseFraOgMed,
        deltagelseTilOgMed,
        kilde,
        deltakelseStatus,
        antallDagerPerUke,
    } = tiltaksdeltagelse;

    return (
        <div className={style.saksopplysninger}>
            <OpplysningerBlokk header={'Tiltak registrert på bruker'}>
                {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                    <BehandlingOppdaterSaksopplysninger />
                )}
                <Opplysning navn={'Type'} verdi={typeNavn} />
                {deltagelseFraOgMed && deltagelseTilOgMed && (
                    <Opplysning
                        navn={'Periode'}
                        verdi={periodeTilFormatertDatotekst({
                            fraOgMed: deltagelseFraOgMed,
                            tilOgMed: deltagelseTilOgMed,
                        })}
                    />
                )}
                <Opplysning navn={'Registerkilde'} verdi={kilde} />
                <Opplysning navn={'Status'} verdi={deltakelseStatus} />
                {antallDagerPerUke && (
                    <Opplysning navn={'Antall dager i uka'} verdi={antallDagerPerUke.toString()} />
                )}
            </OpplysningerBlokk>

            <Separator />

            <OpplysningerBlokk header={'Alder'}>
                <BodyShort weight={'semibold'}>{`${alderFraDato(fødselsdato)} år`}</BodyShort>
                <Opplysning navn={'Fødselsdato'} verdi={fødselsdato} />
            </OpplysningerBlokk>

            <Separator />

            <OpplysningerBlokk header={'Fra søknad'}>
                <Opplysning
                    navn={'Kravdato'}
                    verdi={formaterDatotekst(tidsstempelHosOss)}
                    spacing={true}
                />
                <Opplysning navn={'Tiltak'} verdi={tiltak.typeNavn} />
                <Opplysning
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
                <Opplysning navn={'Etterlønn'} verdi={etterlønn ? 'Ja' : 'Nei'} />
                <OpplysningMedPeriode
                    navn={'Mottar sykepenger og fortsatt sykmeldt'}
                    periode={sykepenger}
                />
                <Opplysning navn={'Mottar pengestøtte'} verdi={'Tja?'} spacing={true} />
                {barnetillegg.length > 0 && (
                    <>
                        <BodyShort>{'Barn:'}</BodyShort>
                        {barnetillegg.map((barn, index) => (
                            <Fragment key={`${barn.fødselsdato}-${index}`}>
                                <Opplysning
                                    navn={'Navn'}
                                    verdi={[barn.fornavn, barn.mellomnavn, barn.etternavn]
                                        .filter(Boolean)
                                        .join(' ')}
                                />
                                <Opplysning navn={'Fødselsdato'} verdi={barn.fødselsdato} />
                                <Opplysning
                                    navn={'Oppholder seg i Norge/EØS?'}
                                    verdi={barn.oppholderSegIEØS ? 'Ja' : 'Nei'}
                                    spacing={true}
                                />
                            </Fragment>
                        ))}
                    </>
                )}
                <Opplysning
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
            </OpplysningerBlokk>
        </div>
    );
};

type OpplysingerBlokkProps = { header: string; children: ReactNode };

const OpplysningerBlokk = ({ header, children }: OpplysingerBlokkProps) => {
    return (
        <>
            <Heading size={'small'} level={'3'} className={style.header}>
                {header}
            </Heading>
            {children}
        </>
    );
};

type OpplysningProps = { navn: string; verdi: string; spacing?: boolean };

const Opplysning = ({ navn, verdi, spacing }: OpplysningProps) => {
    return (
        <BodyShort
            size={'small'}
            className={classNames(style.opplysning, spacing && style.spacing)}
        >
            {`${navn}: `}
            <strong>{verdi}</strong>
        </BodyShort>
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
            <Opplysning navn={navn} verdi={'Ja'} />
            <Opplysning
                navn={navn}
                verdi={periodeTilFormatertDatotekst({
                    fraOgMed: periode.fraOgMed,
                    tilOgMed: periode.tilOgMed,
                })}
                spacing={spacing}
            />
        </>
    ) : (
        <Opplysning navn={navn} verdi={'Nei'} spacing={spacing} />
    );
};
