import { InlineMessage, Tag } from '@navikt/ds-react';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Periode } from '~/types/Periode';
import {
    erInnenforPeriodeForReversertOpphør,
    hentPerioderForReversertOpphørForDeltakelse,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/reversertOpphør/reversertOpphørUtils';
import { formaterPeriode } from '~/utils/date';

export const ReversertOpphørTag = () => (
    <Tag data-color={'warning'} variant={'moderate'} size={'small'}>
        {'Reversert opphør – ingen gyldig tiltaksdeltakelse'}
    </Tag>
);

type Props = {
    behandling: Rammebehandling;
    internDeltakelseId: string;
    perioder: Periode[];
};

export const ReversertOpphørMelding = ({ behandling, internDeltakelseId, perioder }: Props) => {
    const erInnenfor = perioder.every((periode) =>
        erInnenforPeriodeForReversertOpphør(behandling, internDeltakelseId, periode),
    );

    if (!erInnenfor) {
        const perioderForReversertOpphør = hentPerioderForReversertOpphørForDeltakelse(
            behandling,
            internDeltakelseId,
        )
            .map((it) => formaterPeriode(it.periode))
            .join(', ');

        return (
            <InlineMessage status={'error'} size={'small'}>
                {`Et reversert opphør må være innenfor en periode som tidligere har vært innvilget (${perioderForReversertOpphør})`}
            </InlineMessage>
        );
    }

    return (
        <InlineMessage status={'warning'} size={'small'}>
            {
                'Tiltaksdeltakelsen er ikke lenger gyldig. Tiltaket fra den opprinnelige innvilgelsen brukes.'
            }
        </InlineMessage>
    );
};
