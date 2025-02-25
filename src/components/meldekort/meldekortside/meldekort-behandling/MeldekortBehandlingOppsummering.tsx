import { HStack, BodyShort, Button } from '@navikt/ds-react';
import { ukeHeading } from '../../../../utils/date';
import { Utbetalingsuke } from '../Utbetalingsuke';
import { useRef } from 'react';
import { useGodkjennMeldekort } from '../../hooks/useGodkjennMeldekort';
import { kanBeslutteForMeldekort } from '../../../../utils/tilganger';
import BekreftelsesModal from '../../../modaler/BekreftelsesModal';
import { MeldeperiodeMedBehandlingProps } from '../../../../types/meldekort/Meldeperiode';
import { useSaksbehandler } from '../../../../context/saksbehandler/useSaksbehandler';
import { useSak } from '../../../../context/sak/useSak';
import { useMeldeperiodeKjede } from '../../../../context/meldeperioder/useMeldeperiodeKjede';

import styles from '../Meldekort.module.css';

type Props = {
    meldeperiode: MeldeperiodeMedBehandlingProps;
};

export const MeldekortBehandlingOppsummering = ({ meldeperiode }: Props) => {
    const { sakId } = useSak().sak;
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { setMeldekortbehandling } = useMeldeperiodeKjede();

    const { meldekortBehandling } = meldeperiode;

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
            <HStack gap="5" className={styles.totalbeløp}>
                <BodyShort weight="semibold">Totalt beløp for perioden:</BodyShort>
                <BodyShort weight="semibold">
                    {meldekortBehandling.totalbeløpTilUtbetaling},-
                </BodyShort>
            </HStack>
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
                        body={
                            'Er du sikker på at meldekortet er korrekt og ønsker å sende det til utbetaling?'
                        }
                        error={godkjennMeldekortFeil}
                        lukkModal={lukkModal}
                    >
                        <Button
                            size="small"
                            loading={godkjennMeldekortLaster}
                            onClick={() =>
                                godkjennMeldekort().then((meldekortBehandling) => {
                                    setMeldekortbehandling(meldeperiode.id, meldekortBehandling);
                                })
                            }
                        >
                            Godkjenn meldekort
                        </Button>
                    </BekreftelsesModal>
                </>
            )}
        </>
    );
};
