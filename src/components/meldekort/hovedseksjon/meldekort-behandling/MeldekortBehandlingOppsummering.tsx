import { HStack, BodyShort, Button, VStack, Heading, Textarea } from '@navikt/ds-react';
import { ukeHeading } from '../../../../utils/date';
import { Utbetalingsuke } from './Utbetalingsuke';
import { useRef } from 'react';
import { useGodkjennMeldekort } from '../../hooks/useGodkjennMeldekort';
import { kanBeslutteForMeldekort } from '../../../../utils/tilganger';
import { BekreftelsesModal } from '../../../modaler/BekreftelsesModal';
import { useSak } from '../../../../context/sak/SakContext';
import { useSaksbehandler } from '../../../../context/saksbehandler/SaksbehandlerContext';
import { MeldeperiodeProps } from '../../../../types/meldekort/Meldeperiode';
import { MeldekortBehandlingProps } from '../../../../types/meldekort/MeldekortBehandling';
import { useMeldeperiodeKjede } from '../../context/MeldeperiodeKjedeContext';

import styles from '../MeldekortHovedseksjon.module.css';

type Props = {
    meldeperiode: MeldeperiodeProps;
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortBehandlingOppsummering = ({ meldeperiode, meldekortBehandling }: Props) => {
    const { sakId } = useSak().sak;
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { oppdaterMeldekortBehandling } = useMeldeperiodeKjede();

    const { godkjennMeldekort, godkjennMeldekortLaster, reset, godkjennMeldekortFeil } =
        useGodkjennMeldekort(meldekortBehandling.id, sakId);

    const modalRef = useRef<HTMLDialogElement>(null);

    const lukkModal = () => {
        modalRef.current?.close();
        reset();
    };

    //B: Må endre denne til å ta inn beslutter på meldekortet når vi har lagt til tildeling.
    const kanBeslutte = kanBeslutteForMeldekort(meldekortBehandling, innloggetSaksbehandler);

    const uke1 = meldekortBehandling.dager.slice(0, 7);
    const uke2 = meldekortBehandling.dager.slice(7, 14);

    return (
        <>
            <Utbetalingsuke
                utbetalingUke={uke1}
                headingtekst={ukeHeading(meldeperiode.periode.fraOgMed)}
            />
            <Utbetalingsuke
                utbetalingUke={uke2}
                headingtekst={ukeHeading(meldeperiode.periode.tilOgMed)}
            />
            {meldekortBehandling.begrunnelse && (
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
                            defaultValue={meldekortBehandling.begrunnelse}
                        />
                    </>
                </VStack>
            )}
            <VStack>
                <HStack gap="5" className={styles.totalbeløp}>
                    <BodyShort weight="semibold">Totalt ordinær beløp for perioden:</BodyShort>
                    <BodyShort weight="semibold" className={styles.meldekortBeløp}>
                        {meldekortBehandling.totalOrdinærBeløpTilUtbetaling},-
                    </BodyShort>
                </HStack>
                <HStack gap="5" className={styles.totalbeløp}>
                    <BodyShort weight="semibold">Totalt barnetillegg beløp for perioden:</BodyShort>
                    <BodyShort weight="semibold" className={styles.meldekortBeløp}>
                        {meldekortBehandling.totalBarnetilleggTilUtbetaling},-
                    </BodyShort>
                </HStack>
                <HStack gap="5" className={styles.totalbeløp}>
                    <BodyShort weight="semibold">Totalt beløp for perioden:</BodyShort>
                    <BodyShort weight="semibold" className={styles.meldekortBeløp}>
                        {meldekortBehandling.totalbeløpTilUtbetaling},-
                    </BodyShort>
                </HStack>
            </VStack>
            <HStack gap="5" className={styles.totalbeløp}>
                <BodyShort weight="semibold">Nav-kontor det skal utbetales fra: </BodyShort>
                <BodyShort weight="semibold">
                    {meldekortBehandling.navkontorNavn
                        ? `${meldekortBehandling.navkontorNavn} (${meldekortBehandling.navkontor})`
                        : meldekortBehandling.navkontor}
                </BodyShort>
            </HStack>
            {kanBeslutte && (
                <>
                    <HStack justify="start" gap="3" align="end">
                        <Button
                            size="small"
                            loading={godkjennMeldekortLaster}
                            onClick={() => modalRef.current?.showModal()}
                        >
                            Godkjenn meldekort
                        </Button>
                    </HStack>
                    <BekreftelsesModal
                        modalRef={modalRef}
                        tittel={'Godkjenn meldekortet'}
                        feil={godkjennMeldekortFeil}
                        lukkModal={lukkModal}
                        bekreftKnapp={
                            <Button
                                size={'small'}
                                loading={godkjennMeldekortLaster}
                                onClick={() =>
                                    godkjennMeldekort().then((meldekortBehandling) => {
                                        if (meldekortBehandling) {
                                            oppdaterMeldekortBehandling(meldekortBehandling);
                                        }
                                    })
                                }
                            >
                                {'Godkjenn meldekort'}
                            </Button>
                        }
                    >
                        {
                            'Er du sikker på at meldekortet er korrekt og ønsker å sende det til utbetaling?'
                        }
                    </BekreftelsesModal>
                </>
            )}
        </>
    );
};
