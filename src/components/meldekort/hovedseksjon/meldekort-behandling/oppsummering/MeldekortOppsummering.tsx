import { BodyShort, Heading, Textarea, VStack } from '@navikt/ds-react';
import { formaterTidspunktKort } from '../../../../../utils/date';
import { MeldekortBehandlingProps } from '../../../../../types/meldekort/MeldekortBehandling';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import { MeldekortBeløp } from '../beløp/MeldekortBeløp';
import { MeldekortUker } from '../../uker/MeldekortUker';
import { MeldekortKorrigertTilPåfølgendePerioder } from '../korrigert-til-påfølgende/MeldekortKorrigertTilPåfølgendePerioder';

import style from './MeldekortOppsummering.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortOppsummering = ({ meldekortBehandling }: Props) => {
    const { finnForrigeMeldekortBehandling } = useMeldeperiodeKjede();
    const {
        beregning,
        begrunnelse,
        navkontor,
        navkontorNavn,
        godkjentTidspunkt,
        dager,
        utbetalingsstatus,
    } = meldekortBehandling;

    const forrigeBeregning = finnForrigeMeldekortBehandling(meldekortBehandling.id)?.beregning;

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
            {beregning && (
                <>
                    <MeldekortKorrigertTilPåfølgendePerioder
                        beregninger={beregning.beregningerForPåfølgendePerioder}
                    />
                    <MeldekortBeløp
                        beløp={beregning.beregningForMeldekortetsPeriode.beløp}
                        forrigeBeløp={forrigeBeregning?.beregningForMeldekortetsPeriode.beløp}
                        totalBeløp={beregning.totalBeløp}
                        utbetalingsstatus={utbetalingsstatus}
                        navkontorForUtbetaling={
                            navkontorNavn ? `${navkontorNavn} (${navkontor})` : navkontor
                        }
                    />
                </>
            )}
        </VStack>
    );
};
