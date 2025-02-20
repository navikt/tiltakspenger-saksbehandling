import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { periodeTilFormatertDatotekst } from '../../../../utils/date';
import { Tiltaksdeltagelse } from '../../../../types/TiltakDeltagelseTypes';

type Props = {
    tiltaksdeltagelse: Tiltaksdeltagelse;
};

export const BehandlingTiltakOpplysninger = ({ tiltaksdeltagelse }: Props) => {
    const {
        antallDagerPerUke,
        deltakelseStatus,
        deltagelseTilOgMed,
        deltagelseFraOgMed,
        typeNavn,
        kilde,
    } = tiltaksdeltagelse;

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
            <BehandlingSaksopplysning navn={'Registerkilde'} verdi={kildeMap[kilde] ?? kilde} />
            <BehandlingSaksopplysning navn={'Status'} verdi={deltakelseStatus} />
            {antallDagerPerUke && (
                <BehandlingSaksopplysning
                    navn={'Antall dager i uka'}
                    verdi={antallDagerPerUke.toString()}
                />
            )}
        </>
    );
};

const kildeMap: Record<string, string> = {
    Komet: 'Modia arbeidsrettet oppfølging',
} as const;
