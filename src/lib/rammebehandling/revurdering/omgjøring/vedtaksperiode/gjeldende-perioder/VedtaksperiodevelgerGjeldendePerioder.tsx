import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import { formaterPeriode } from '~/utils/date';
import {
    useOmgjøringSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { Periode } from '~/types/Periode';
import { OmgjøringResultat, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

type Props = {
    perioderSomKanOmgjøres: Periode[];
    valgtResultat: OmgjøringResultat;
    className?: string;
};

export const VedtaksperiodevelgerGjeldendePerioder = ({
    perioderSomKanOmgjøres,
    valgtResultat,
    className,
}: Props) => {
    const erOpphør = valgtResultat === RevurderingResultat.OMGJØRING_OPPHØR;

    const periodeTekst = erOpphør ? 'innvilgelsesperiode' : 'vedtaksperiode';

    if (perioderSomKanOmgjøres.length === 0) {
        return null;
    }

    if (perioderSomKanOmgjøres.length === 1) {
        return (
            <HStack gap={'space-4'} align={'center'} className={className}>
                <BodyShort size={'small'}>{`Gjeldende ${periodeTekst} på saken: `}</BodyShort>
                <PeriodeMedVelgKnapp periode={perioderSomKanOmgjøres.atNonNull(0)} />
            </HStack>
        );
    }

    return (
        <VStack gap={'space-4'} align={'start'} className={className}>
            <BodyShort size={'small'}>{`Gjeldende ${periodeTekst}r på saken:`}</BodyShort>
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
            <BodyShort size={'small'}>{formaterPeriode(periode)}</BodyShort>
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
