import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { TiltaksdeltakelseMedPeriode } from '~/types/TiltakDeltakelse';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { Separator } from '~/components/separator/Separator';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';

export const BehandlingTiltak = () => {
    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Høyre>
                    <VedtakHjelpetekst variant={'warning'}>
                        Flere tiltak registrert på bruker. Velg tiltak(ene) som bruker skal vurderes
                        for og periodene som gjelder. Det du velger brukes for regnskapsføring og
                        statistikk, og påvirker ikke vedtaket.
                    </VedtakHjelpetekst>
                </VedtakSeksjon.Høyre>
            </VedtakSeksjon>
            <Separator />
        </>
    );
};

export const getVisningsnavn = (
    tiltaksdeltagelse: TiltaksdeltakelseMedPeriode,
    tiltaksdeltakelser: TiltaksdeltakelseMedPeriode[],
): string => {
    const deltakelserMedType = tiltaksdeltakelser.filter(
        (t) => t.typeKode === tiltaksdeltagelse.typeKode,
    );
    if (deltakelserMedType.length > 1) {
        return `${tiltaksdeltagelse.typeNavn} (${periodeTilFormatertDatotekst({
            fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed,
            tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed,
        })})`;
    } else {
        return tiltaksdeltagelse.typeNavn;
    }
};
