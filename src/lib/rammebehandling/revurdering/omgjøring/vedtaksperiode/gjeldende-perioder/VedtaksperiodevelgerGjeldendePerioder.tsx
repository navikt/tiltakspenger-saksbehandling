import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import {
    useOmgjøringSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { Periode } from '~/types/Periode';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';
import { OmgjøringResultat, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

type Props = {
    vedtakSomOmgjøres: Rammevedtak;
    valgtResultat: OmgjøringResultat;
    className?: string;
};

export const VedtaksperiodevelgerGjeldendePerioder = ({
    vedtakSomOmgjøres,
    valgtResultat,
    className,
}: Props) => {
    const { gjeldendeVedtaksperioder, gjeldendeInnvilgetPerioder } = vedtakSomOmgjøres;

    const erOpphør = valgtResultat === RevurderingResultat.OMGJØRING_OPPHØR;

    const perioderSomKanOmgjøres = erOpphør ? gjeldendeInnvilgetPerioder : gjeldendeVedtaksperioder;

    const periodeTekst = erOpphør ? 'innvilgelsesperiode' : 'vedtaksperiode';

    if (perioderSomKanOmgjøres.length === 0) {
        return null;
    }

    if (perioderSomKanOmgjøres.length === 1) {
        return (
            <HStack gap={'space-4'} align={'center'} className={className}>
                <BodyShort size={'small'}>{`Gjeldende ${periodeTekst}: `}</BodyShort>
                <PeriodeMedVelgKnapp periode={perioderSomKanOmgjøres.at(0)!} />
            </HStack>
        );
    }

    return (
        <VStack gap={'space-4'} align={'start'} className={className}>
            <BodyShort size={'small'}>{`Gjeldende ${periodeTekst}r:`}</BodyShort>
            {perioderSomKanOmgjøres.map((periode) => (
                <PeriodeMedVelgKnapp
                    periode={periode}
                    key={`${periode.fraOgMed}-${periode.tilOgMed}`}
                />
            ))}
        </VStack>
    );
};

const PeriodeMedVelgKnapp = ({ periode }: { periode: Periode }) => {
    const { erReadonly } = useOmgjøringSkjema();
    const dispatch = useOmgjøringSkjemaDispatch();

    return (
        <HStack gap={'space-8'} align={'center'}>
            <BodyShort size={'small'}>{periodeTilFormatertDatotekst(periode)}</BodyShort>
            {!erReadonly && (
                <Button
                    type={'button'}
                    variant={'tertiary'}
                    size={'xsmall'}
                    onClick={() => {
                        dispatch({
                            type: 'oppdaterVedtaksperiode',
                            payload: { periodeOppdatering: periode },
                        });
                    }}
                >
                    {'Fyll inn periode'}
                </Button>
            )}
        </HStack>
    );
};
