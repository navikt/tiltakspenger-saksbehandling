import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { Tiltaksdeltakelse, TiltaksdeltakelseKilde } from '~/types/TiltakDeltakelse';
import { VStack } from '@navikt/ds-react';

type Props = {
    tiltaksdeltakelser: Tiltaksdeltakelse[];
};

export const BehandlingTiltakOpplysninger = ({ tiltaksdeltakelser }: Props) => {
    return (
        <VStack gap="space-8">
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
                                verdi={periodeTilFormatertDatotekst({
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

const kildeTekst: Record<TiltaksdeltakelseKilde, string> = {
    [TiltaksdeltakelseKilde.ARENA]: 'Arena',
    [TiltaksdeltakelseKilde.KOMET]: 'Modia arbeidsrettet oppfølging',
} as const;
