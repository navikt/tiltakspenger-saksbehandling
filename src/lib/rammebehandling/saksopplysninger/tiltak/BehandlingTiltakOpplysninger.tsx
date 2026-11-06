import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { formaterPeriode } from '~/utils/date';
import { erLukketPeriode } from '~/utils/periode';
import {
    tiltakDeltakerstatusTekst,
    Tiltaksdeltakelse,
    TiltaksdeltakelseSomFratarRett,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { BodyShort, ReadMore, VStack } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { delOppTiltaksdeltakelser, kildeTekst, prosentTekst } from './tiltaksdeltakelseVisning';
import { GirIkkeRettTag } from './GirIkkeRettTag';
import { TiltakshistorikkForTiltak } from '../tiltakshistorikk/TiltakshistorikkForTiltak';
import { TiltakshistorikkForBehandling } from '~/lib/rammebehandling/typer/Tiltakshistorikk';
import { Tidspunkt } from '~/types/DatoTid';

type Historikk = {
    tiltakshistorikk: TiltakshistorikkForBehandling;
    sistEndret: Tidspunkt;
    oppslagstidspunkt: Tidspunkt;
};

type Props = {
    tiltaksdeltakelser: Tiltaksdeltakelse[];
    tiltaksdeltakelserSomFratarRett: TiltaksdeltakelseSomFratarRett[];
    vurderingsperiode: Nullable<Periode>;
    historikk: Historikk;
};

export const BehandlingTiltakOpplysninger = ({
    tiltaksdeltakelser,
    tiltaksdeltakelserSomFratarRett,
    vurderingsperiode,
    historikk,
}: Props) => {
    return (
        <VStack gap="space-16">
            <TiltakSomGirRett
                tiltaksdeltakelser={tiltaksdeltakelser}
                vurderingsperiode={vurderingsperiode}
                historikk={historikk}
            />
            {tiltaksdeltakelserSomFratarRett.length > 0 && (
                <TiltakSomFratarRettListe tiltaksdeltakelser={tiltaksdeltakelserSomFratarRett} />
            )}
        </VStack>
    );
};

const TiltakSomGirRett = ({
    tiltaksdeltakelser,
    vurderingsperiode,
    historikk,
}: Pick<Props, 'tiltaksdeltakelser' | 'vurderingsperiode' | 'historikk'>) => {
    if (tiltaksdeltakelser.length === 0) {
        return <BodyShort size={'small'}>{'Ingen relevante tiltaksdeltakelser'}</BodyShort>;
    }

    const { aktuelle, historiske } = delOppTiltaksdeltakelser(
        tiltaksdeltakelser,
        vurderingsperiode,
    );

    return (
        <VStack gap={'space-8'}>
            {aktuelle.length > 0 ? (
                <TiltakListe tiltaksdeltakelser={aktuelle} historikk={historikk} />
            ) : (
                <BodyShort size={'small'}>{'Ingen aktuelle tiltaksdeltakelser'}</BodyShort>
            )}
            {historiske.length > 0 && (
                <ReadMore size={'small'} header={`Tidligere tiltak (${historiske.length})`}>
                    <TiltakListe tiltaksdeltakelser={historiske} historikk={historikk} />
                </ReadMore>
            )}
        </VStack>
    );
};

const TiltakSomFratarRettListe = ({
    tiltaksdeltakelser,
}: {
    tiltaksdeltakelser: TiltaksdeltakelseSomFratarRett[];
}) => {
    return (
        <VStack gap={'space-12'}>
            {tiltaksdeltakelser.map((tiltak) => {
                const {
                    eksternDeltakelseId,
                    typeNavn,
                    periode,
                    deltakelseStatus,
                    deltakelseProsent,
                    antallDagerPerUke,
                    kilde,
                } = tiltak;

                return (
                    <VStack key={eksternDeltakelseId} gap={'space-4'} align={'start'}>
                        <GirIkkeRettTag />
                        <div>
                            <BehandlingSaksopplysning navn={'Type'} verdi={typeNavn} />
                            <BehandlingSaksopplysning
                                navn={'Periode'}
                                verdi={
                                    erLukketPeriode(periode) ? formaterPeriode(periode) : 'Ukjent'
                                }
                            />
                            <BehandlingSaksopplysning
                                navn={'Registerkilde'}
                                verdi={kildeTekst[kilde]}
                            />
                            <BehandlingSaksopplysning
                                navn={'Status'}
                                verdi={tiltakDeltakerstatusTekst[deltakelseStatus]}
                            />
                            <BehandlingSaksopplysning
                                navn={'Antall dager i uka'}
                                verdi={antallDagerPerUke?.toString() ?? 'Ukjent'}
                            />
                            <BehandlingSaksopplysning
                                navn={'Deltakelsesprosent'}
                                verdi={prosentTekst(deltakelseProsent)}
                            />
                            <BehandlingSaksopplysning
                                navn={'Deltakelse-id'}
                                verdi={eksternDeltakelseId}
                            />
                        </div>
                    </VStack>
                );
            })}
        </VStack>
    );
};

const TiltakListe = ({
    tiltaksdeltakelser,
    historikk,
}: {
    tiltaksdeltakelser: Tiltaksdeltakelse[];
    historikk: Historikk;
}) => {
    return (
        <VStack gap="space-12">
            {tiltaksdeltakelser.map((tiltak) => {
                const {
                    antallDagerPerUke,
                    deltakelseProsent,
                    deltakelseStatus,
                    periode,
                    typeNavn,
                    kilde,
                    gjennomføringId,
                    gjennomforingsprosent,
                    eksternDeltagelseId,
                    internDeltakelseId,
                } = tiltak;

                return (
                    <VStack key={eksternDeltagelseId} gap={'space-8'} align={'start'}>
                        <div>
                            <BehandlingSaksopplysning navn={'Type'} verdi={typeNavn} />
                            {erLukketPeriode(periode) && (
                                <BehandlingSaksopplysning
                                    navn={'Periode'}
                                    verdi={formaterPeriode(periode)}
                                />
                            )}
                            <BehandlingSaksopplysning
                                navn={'Registerkilde'}
                                verdi={kildeTekst[kilde]}
                            />
                            <BehandlingSaksopplysning navn={'Status'} verdi={deltakelseStatus} />
                            <BehandlingSaksopplysning
                                navn={'Antall dager i uka'}
                                verdi={antallDagerPerUke?.toString() ?? 'Ukjent'}
                            />
                            <BehandlingSaksopplysning
                                navn={'Deltakelsesprosent'}
                                verdi={prosentTekst(deltakelseProsent)}
                            />
                            <BehandlingSaksopplysning
                                navn={'Gjennomføringsprosent'}
                                verdi={prosentTekst(gjennomforingsprosent) ?? 'Ukjent'}
                            />
                            <BehandlingSaksopplysning
                                navn={'Gjennomføring-id'}
                                verdi={gjennomføringId ?? 'Ukjent'}
                            />
                            <BehandlingSaksopplysning
                                navn={'Deltakelse-id'}
                                verdi={eksternDeltagelseId ?? 'Ukjent'}
                            />
                        </div>
                        <TiltakshistorikkForTiltak
                            internDeltakelseId={internDeltakelseId}
                            typeNavn={typeNavn}
                            {...historikk}
                        />
                    </VStack>
                );
            })}
        </VStack>
    );
};
