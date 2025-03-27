import { BodyShort, Heading, HStack, Textarea, VStack } from '@navikt/ds-react';
import { ukeHeading } from '../../../../../utils/date';
import { MeldekortOppsummeringUke } from './MeldekortOppsummeringUke';
import { MeldekortBehandlingProps } from '../../../../../types/meldekort/MeldekortBehandling';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';

import styles from '../../MeldekortHovedseksjon.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortOppsummering = ({ meldekortBehandling }: Props) => {
    const { periode } = useMeldeperiodeKjede().meldeperiodeKjede;
    const {
        dager,
        begrunnelse,
        totalOrdinærBeløpTilUtbetaling,
        totalBarnetilleggTilUtbetaling,
        totalbeløpTilUtbetaling,
        navkontor,
        navkontorNavn,
    } = meldekortBehandling;

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
                <VStack className={styles.begrunnelse}>
                    <>
                        <Heading size={'xsmall'} level={'2'} className={styles.header}>
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
                    </>
                </VStack>
            )}
            <VStack>
                <HStack gap="5" className={styles.totalbeløp}>
                    <BodyShort weight="semibold">Totalt ordinær beløp for perioden:</BodyShort>
                    <BodyShort weight="semibold" className={styles.meldekortBeløp}>
                        {totalOrdinærBeløpTilUtbetaling},-
                    </BodyShort>
                </HStack>
                <HStack gap="5" className={styles.totalbeløp}>
                    <BodyShort weight="semibold">Totalt barnetillegg beløp for perioden:</BodyShort>
                    <BodyShort weight="semibold" className={styles.meldekortBeløp}>
                        {totalBarnetilleggTilUtbetaling},-
                    </BodyShort>
                </HStack>
                <HStack gap="5" className={styles.totalbeløp}>
                    <BodyShort weight="semibold">Totalt beløp for perioden:</BodyShort>
                    <BodyShort weight="semibold" className={styles.meldekortBeløp}>
                        {totalbeløpTilUtbetaling},-
                    </BodyShort>
                </HStack>
            </VStack>
            <HStack gap="5" className={styles.totalbeløp}>
                <BodyShort weight="semibold">Nav-kontor det skal utbetales fra: </BodyShort>
                <BodyShort weight="semibold">
                    {navkontorNavn ? `${navkontorNavn} (${navkontor})` : navkontor}
                </BodyShort>
            </HStack>
        </VStack>
    );
};
