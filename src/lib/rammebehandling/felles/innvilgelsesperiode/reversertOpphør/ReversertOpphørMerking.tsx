import { InlineMessage, Tag } from '@navikt/ds-react';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { InnvilgelsesperiodePartial } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
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
    innvilgelsesperiode: InnvilgelsesperiodePartial;
};

export const ReversertOpphørMelding = ({ behandling, innvilgelsesperiode }: Props) => {
    if (!erInnenforPeriodeForReversertOpphør(behandling, innvilgelsesperiode)) {
        const perioder = hentPerioderForReversertOpphørForDeltakelse(
            behandling,
            innvilgelsesperiode.internDeltakelseId,
        )
            .map((it) => formaterPeriode(it.periode))
            .join(', ');

        return (
            <InlineMessage status={'error'} size={'small'}>
                {`Et reversert opphør må være innenfor en periode som tidligere har vært innvilget (${perioder})`}
            </InlineMessage>
        );
    }

    return (
        <InlineMessage status={'warning'} size={'small'}>
            {
                'Perioden har ikke lenger en gyldig tiltaksdeltakelse. Tiltaket fra den opprinnelige innvilgelsen brukes.'
            }
        </InlineMessage>
    );
};
