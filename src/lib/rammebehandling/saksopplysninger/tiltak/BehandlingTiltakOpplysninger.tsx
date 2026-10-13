import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { formaterPeriode } from '~/utils/date';
import {
    tiltakDeltakerstatusTekst,
    Tiltaksdeltakelse,
    TiltaksdeltakelseKilde,
    TiltaksdeltakelseSomFratarRett,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { BodyShort, ReadMore, VStack } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { delOppTiltaksdeltakelser } from './tiltaksdeltakelseVisning';
import { GirIkkeRettTag } from './GirIkkeRettTag';

type Props = {
    tiltaksdeltakelser: Tiltaksdeltakelse[];
    tiltaksdeltakelserSomFratarRett: TiltaksdeltakelseSomFratarRett[];
    vurderingsperiode: Nullable<Periode>;
};

export const BehandlingTiltakOpplysninger = ({
    tiltaksdeltakelser,
    tiltaksdeltakelserSomFratarRett,
    vurderingsperiode,
}: Props) => {
    return (
        <VStack gap="space-16">
            <TiltakSomGirRett
                tiltaksdeltakelser={tiltaksdeltakelser}
                vurderingsperiode={vurderingsperiode}
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
}: Pick<Props, 'tiltaksdeltakelser' | 'vurderingsperiode'>) => {
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
                <TiltakListe tiltaksdeltakelser={aktuelle} />
            ) : (
                <BodyShort size={'small'}>{'Ingen aktuelle tiltaksdeltakelser'}</BodyShort>
            )}
            {historiske.length > 0 && (
                <ReadMore size={'small'} header={`Tidligere tiltak (${historiske.length})`}>
                    <TiltakListe tiltaksdeltakelser={historiske} />
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
                    deltakelseFraOgMed,
                    deltakelseTilOgMed,
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
                                    deltakelseFraOgMed && deltakelseTilOgMed
                                        ? formaterPeriode({
                                              fraOgMed: deltakelseFraOgMed,
                                              tilOgMed: deltakelseTilOgMed,
                                          })
                                        : 'Ukjent'
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

const TiltakListe = ({ tiltaksdeltakelser }: { tiltaksdeltakelser: Tiltaksdeltakelse[] }) => {
    return (
        <VStack gap="space-12">
            {tiltaksdeltakelser.map((tiltak) => {
                const {
                    antallDagerPerUke,
                    deltakelseProsent,
                    deltakelseStatus,
                    deltagelseTilOgMed,
                    deltagelseFraOgMed,
                    typeNavn,
                    kilde,
                    gjennomføringId,
                    gjennomforingsprosent,
                    eksternDeltagelseId,
                } = tiltak;

                return (
                    <div key={eksternDeltagelseId}>
                        <BehandlingSaksopplysning navn={'Type'} verdi={typeNavn} />
                        {deltagelseFraOgMed && deltagelseTilOgMed && (
                            <BehandlingSaksopplysning
                                navn={'Periode'}
                                verdi={formaterPeriode({
                                    fraOgMed: deltagelseFraOgMed,
                                    tilOgMed: deltagelseTilOgMed,
                                })}
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
                );
            })}
        </VStack>
    );
};

const prosentTekst = (prosent: number | null) => {
    return prosent !== null && prosent !== undefined ? `${prosent}%` : 'Ukjent';
};

const modiaTekst = 'Modia arbeidsrettet oppfølging';

const kildeTekst: Record<TiltaksdeltakelseKilde, string> = {
    [TiltaksdeltakelseKilde.ARENA]: 'Arena',
    [TiltaksdeltakelseKilde.KOMET]: modiaTekst,
    [TiltaksdeltakelseKilde.TEAM_TILTAK]: modiaTekst,
} as const;
