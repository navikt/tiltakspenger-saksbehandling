import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { periodeTilFormatertDatotekst } from '../../../../utils/date';
import { Tiltaksdeltagelse } from '../../../../types/TiltakDeltagelseTypes';
import { VStack } from '@navikt/ds-react';

type Props = {
    tiltaksdeltagelse: Tiltaksdeltagelse[];
};

export const BehandlingTiltakOpplysninger = ({ tiltaksdeltagelse }: Props) => {
    return (
        <VStack gap="2">
            {tiltaksdeltagelse.map((tiltak) => (
                <div key={tiltak.eksternDeltagelseId}>
                    <TiltaksdeltagelseOpplysning tiltaksdeltagelse={tiltak} />
                </div>
            ))}
        </VStack>
    );
};

const TiltaksdeltagelseOpplysning = (props: { tiltaksdeltagelse: Tiltaksdeltagelse }) => {
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
    } = props.tiltaksdeltagelse;

    return (
        <>
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
            <BehandlingSaksopplysning navn={'Registerkilde'} verdi={kildeTekst[kilde] ?? kilde} />
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
                navn={'Gjennomførings-id'}
                verdi={gjennomføringId ?? 'Ukjent'}
            />
        </>
    );
};

const prosentTekst = (prosent: number | null) => {
    return prosent !== null && prosent !== undefined ? `${prosent}%` : 'Ukjent';
};

const kildeTekst: Record<string, string> = {
    Komet: 'Modia arbeidsrettet oppfølging',
} as const;
