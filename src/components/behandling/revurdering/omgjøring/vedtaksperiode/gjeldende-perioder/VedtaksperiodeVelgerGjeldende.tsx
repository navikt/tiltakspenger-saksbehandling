import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import {
    useOmgjøringInnvilgelseSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { Periode } from '~/types/Periode';

type Props = {
    gjeldendeVedtaksperioder: Periode[];
    className?: string;
};

export const VedtaksperiodeVelgerGjeldende = ({ gjeldendeVedtaksperioder, className }: Props) => {
    if (gjeldendeVedtaksperioder.length === 0) {
        return null;
    }

    if (gjeldendeVedtaksperioder.length === 1) {
        return (
            <HStack gap={'space-4'} align={'center'} className={className}>
                <BodyShort size={'small'}>{'Gjeldende vedtaksperiode: '}</BodyShort>
                <PeriodeMedVelgKnapp periode={gjeldendeVedtaksperioder.at(0)!} />
            </HStack>
        );
    }

    return (
        <VStack gap={'space-4'} align={'start'} className={className}>
            <BodyShort size={'small'}>{'Gjeldende vedtaksperioder:'}</BodyShort>
            {gjeldendeVedtaksperioder.map((periode) => (
                <PeriodeMedVelgKnapp
                    periode={periode}
                    key={`${periode.fraOgMed}-${periode.tilOgMed}`}
                />
            ))}
        </VStack>
    );
};

const PeriodeMedVelgKnapp = ({ periode }: { periode: Periode }) => {
    const { erReadonly } = useOmgjøringInnvilgelseSkjema();
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
                            payload: { periode },
                        });
                    }}
                >
                    {'Velg'}
                </Button>
            )}
        </HStack>
    );
};
