import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { formaterPeriode } from '~/utils/date';
import {
    Tiltaksdeltakelse,
    TiltaksdeltakelseKilde,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { BodyShort, ReadMore, VStack } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { delOppTiltaksdeltakelser } from './tiltaksdeltakelseVisning';

type Props = {
    tiltaksdeltakelser: Tiltaksdeltakelse[];
    vurderingsperiode: Nullable<Periode>;
};

export const BehandlingTiltakOpplysninger = ({ tiltaksdeltakelser, vurderingsperiode }: Props) => {
    const { aktuelle, historiske } = delOppTiltaksdeltakelser(
        tiltaksdeltakelser,
        vurderingsperiode,
    );

    return (
        <VStack gap="space-8">
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
