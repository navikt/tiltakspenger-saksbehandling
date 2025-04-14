import { BodyShort, VStack } from '@navikt/ds-react';
import { formaterTidspunktKort } from '../../../../../utils/date';
import { MeldekortBehandlingProps } from '../../../../../types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../../uker/MeldekortUker';
import { MeldekortBeregningOppsummering } from '../beregning-oppsummering/MeldekortBeregningOppsummering';
import { MeldekortBegrunnelse } from '../begrunnelse/MeldekortBegrunnelse';

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
            <MeldekortBeregningOppsummering meldekortBehandling={meldekortBehandling} />
            {begrunnelse && <MeldekortBegrunnelse readOnly={true} defaultValue={begrunnelse} />}
        </VStack>
    );
};
