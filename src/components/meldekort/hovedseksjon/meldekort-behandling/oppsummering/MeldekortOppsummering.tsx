import { BodyShort, Heading, Textarea, VStack } from '@navikt/ds-react';
import { formaterTidspunktKort } from '../../../../../utils/date';
import { MeldekortBehandlingProps } from '../../../../../types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../../uker/MeldekortUker';
import { MeldekortBeregningOppsummering } from '../beregning-oppsummering/MeldekortBeregningOppsummering';

import style from './MeldekortOppsummering.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortOppsummering = ({ meldekortBehandling }: Props) => {
    const { beregning, begrunnelse, godkjentTidspunkt, dager } = meldekortBehandling;

    return (
        <VStack gap={'5'}>
            <MeldekortUker dager={beregning?.beregningForMeldekortetsPeriode.dager ?? dager} />
            {begrunnelse && (
                <VStack className={style.begrunnelse}>
                    <Heading size={'xsmall'} level={'2'} className={style.header}>
                        {'Begrunnelse (valgfri)'}
                    </Heading>
                    <Textarea
                        label={'Begrunnelse'}
                        hideLabel={true}
                        minRows={5}
                        resize={'vertical'}
                        readOnly={true}
                        defaultValue={begrunnelse}
                    />
                </VStack>
            )}
            {godkjentTidspunkt && (
                <BodyShort size={'small'}>
                    {'Iverksatt '}
                    <strong>{formaterTidspunktKort(godkjentTidspunkt)}</strong>
                </BodyShort>
            )}
            <MeldekortBeregningOppsummering meldekortBehandling={meldekortBehandling} />
        </VStack>
    );
};
