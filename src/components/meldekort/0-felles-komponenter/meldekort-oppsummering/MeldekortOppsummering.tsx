import { BodyShort, VStack } from '@navikt/ds-react';
import { formaterTidspunktKort } from '~/utils/date';
import { MeldekortBehandlingProps } from '~/types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../uker/MeldekortUker';
import { MeldekortBegrunnelse } from '../begrunnelse/MeldekortBegrunnelse';
import { MeldekortBeregningOgSimulering } from '~/components/meldekort/0-felles-komponenter/beregning-simulering/MeldekortBeregningOgSimulering';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortOppsummering = ({ meldekortBehandling }: Props) => {
    const { beregning, begrunnelse, godkjentTidspunkt, dager } = meldekortBehandling;

    return (
        <VStack gap={'5'}>
            <MeldekortUker dager={beregning?.beregningForMeldekortetsPeriode.dager ?? dager} />
            {godkjentTidspunkt && (
                <BodyShort size={'small'}>
                    {'Godkjent: '}
                    <strong>{formaterTidspunktKort(godkjentTidspunkt)}</strong>
                </BodyShort>
            )}
            <MeldekortBeregningOgSimulering meldekortBehandling={meldekortBehandling} />
            {begrunnelse && <MeldekortBegrunnelse readOnly={true} defaultValue={begrunnelse} />}
        </VStack>
    );
};
