import { BodyShort, Heading, Textarea, VStack } from '@navikt/ds-react';
import { formaterTidspunktKort, ukeHeading } from '../../../../../utils/date';
import { MeldekortOppsummeringUke } from './uke/MeldekortOppsummeringUke';
import { MeldekortBehandlingProps } from '../../../../../types/meldekort/MeldekortBehandling';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import { MeldekortBeløp } from '../beløp/MeldekortBeløp';

import style from './MeldekortOppsummering.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortOppsummering = ({ meldekortBehandling }: Props) => {
    const { meldeperiodeKjede, finnForrigeMeldekortBehandling } = useMeldeperiodeKjede();
    const { periode } = meldeperiodeKjede;
    const { beregning, begrunnelse, navkontor, navkontorNavn, godkjentTidspunkt } =
        meldekortBehandling;

    const { beløp, dager } = beregning!.beregningForMeldekortetsPeriode;

    const uke1 = dager.slice(0, 7);
    const uke2 = dager.slice(7, 14);

    return (
        <VStack gap={'5'}>
            <MeldekortOppsummeringUke
                utbetalingUke={uke1}
                headingtekst={ukeHeading(periode.fraOgMed)}
            />
            <MeldekortOppsummeringUke
                utbetalingUke={uke2}
                headingtekst={ukeHeading(periode.tilOgMed)}
            />
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
                    {'Iverksatt: '}
                    <strong>{formaterTidspunktKort(godkjentTidspunkt)}</strong>
                </BodyShort>
            )}
            <MeldekortBeløp
                beløp={beløp}
                forrigeBeløp={
                    finnForrigeMeldekortBehandling(meldekortBehandling.id)?.beregning
                        ?.beregningForMeldekortetsPeriode.beløp
                }
                navkontorForUtbetaling={
                    navkontorNavn ? `${navkontorNavn} (${navkontor})` : navkontor
                }
            />
        </VStack>
    );
};
