import { HStack, BodyShort, Button } from '@navikt/ds-react';
import { ukeHeading } from '../../../../utils/date';
import { Utbetalingsuke } from '../Utbetalingsuke';
import { useContext, useRef } from 'react';
import { SakContext } from '../../../layout/SakLayout';
import { useGodkjennMeldekort } from '../../../../hooks/meldekort/useGodkjennMeldekort';
import { kanBeslutteForBehandling } from '../../../../utils/tilganger';
import { SaksbehandlerContext } from '../../../../context/saksbehandler/SaksbehandlerContext';
import BekreftelsesModal from '../../../bekreftelsesmodal/BekreftelsesModal';
import { MeldeperiodeProps } from '../../../../types/MeldekortTypes';

import styles from '../Meldekort.module.css';

type Props = {
    meldeperiode: MeldeperiodeProps;
};

export const MeldekortBehandlingOppsummering = ({ meldeperiode }: Props) => {
    const { sakId, saknummer } = useContext(SakContext);
    const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
    const { meldekortBehandling } = meldeperiode;

    const { onGodkjennMeldekort, isMeldekortMutating, reset, feilVedGodkjenning } =
        useGodkjennMeldekort(meldekortBehandling.id, sakId, saknummer);

    const modalRef = useRef(null);

    const lukkModal = () => {
        modalRef.current.close();
        reset();
    };

    //B: Må endre denne til å ta inn beslutter på meldekortet når vi har lagt til tildeling.
    const kanBeslutte = kanBeslutteForBehandling(
        meldekortBehandling.status,
        innloggetSaksbehandler,
        meldekortBehandling.saksbehandler,
        innloggetSaksbehandler.navIdent,
    );

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
                <BodyShort weight="semibold">Navkontor det skal utbetales fra:</BodyShort>
                <BodyShort weight="semibold">
                    {meldekortBehandling.navkontorNavn || meldekortBehandling.navkontor}
                </BodyShort>
            </HStack>
            {kanBeslutte && (
                <>
                    <HStack justify="start" gap="3" align="end">
                        <Button
                            size="small"
                            loading={isMeldekortMutating}
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
                        error={feilVedGodkjenning}
                        lukkModal={lukkModal}
                    >
                        <Button
                            size="small"
                            loading={isMeldekortMutating}
                            onClick={() => onGodkjennMeldekort()}
                        >
                            Godkjenn meldekort
                        </Button>
                    </BekreftelsesModal>
                </>
            )}
        </>
    );
};
