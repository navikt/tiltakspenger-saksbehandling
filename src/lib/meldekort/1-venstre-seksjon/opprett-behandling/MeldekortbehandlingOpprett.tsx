import { Alert, Button, Loader, Link } from '@navikt/ds-react';
import { useOpprettMeldekortbehandling } from './useOpprettMeldekortbehandling';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { useRef } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldeperiodeKjede } from '../../context/MeldeperiodeKjedeContext';
import { MeldekortbehandlingType } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldeperiodeKjedeStatus } from '~/lib/meldekort/typer/Meldeperiode';
import NextLink from 'next/link';
import { meldeperiodeUrl } from '~/utils/urls';
import { periodeTilFormatertDatotekst } from '~/utils/date';

import styles from './MeldekortbehandlingOpprett.module.css';

type Props = {
    type: MeldekortbehandlingType;
};

export const MeldekortbehandlingOpprett = ({ type }: Props) => {
    const { sakId, saksnummer } = useSak().sak;
    const { setMeldeperiodeKjede, meldeperiodeKjede } = useMeldeperiodeKjede();

    const { id: kjedeId, status: kjedeStatus, periodeMedÅpenBehandling } = meldeperiodeKjede;

    const { opprett, laster, feil } = useOpprettMeldekortbehandling({
        kjedeId,
        sakId,
    });

    const tekster = teksterForType[type];

    const modalRef = useRef<HTMLDialogElement>(null);

    const lukkModal = () => modalRef.current?.close();

    return (
        <div>
            {feil && (
                <Alert variant={'error'} className={styles.varsel}>
                    {feil.message}
                </Alert>
            )}
            {kjedeStatus === MeldeperiodeKjedeStatus.IKKE_RETT_TIL_TILTAKSPENGER ? (
                <Alert variant={'info'} className={styles.varsel}>
                    {'Ikke rett til tiltakspenger for denne perioden'}
                </Alert>
            ) : (
                <>
                    {periodeMedÅpenBehandling &&
                        periodeMedÅpenBehandling.fraOgMed !== meldeperiodeKjede.periode.fraOgMed &&
                        periodeMedÅpenBehandling.tilOgMed !==
                            meldeperiodeKjede.periode.tilOgMed && (
                            <Alert
                                variant={'warning'}
                                inline={true}
                                size={'small'}
                                className={styles.varsel}
                            >
                                {`Det finnes allerede en åpen meldekortbehandling på saken - se `}
                                <Link
                                    as={NextLink}
                                    href={meldeperiodeUrl(saksnummer, periodeMedÅpenBehandling)}
                                >
                                    {periodeTilFormatertDatotekst(periodeMedÅpenBehandling)}
                                </Link>
                            </Alert>
                        )}
                    <Button
                        disabled={
                            !!periodeMedÅpenBehandling &&
                            periodeMedÅpenBehandling.fraOgMed !==
                                meldeperiodeKjede.periode.fraOgMed &&
                            periodeMedÅpenBehandling.tilOgMed !== meldeperiodeKjede.periode.tilOgMed
                        }
                        onClick={() => modalRef.current?.showModal()}
                        className={styles.knapp}
                    >
                        {tekster.start}
                    </Button>
                </>
            )}
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={tekster.modalTittel}
                feil={feil}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        icon={laster && <Loader />}
                        disabled={laster}
                        onClick={() => {
                            opprett().then((oppdatertKjede) => {
                                if (oppdatertKjede) {
                                    setMeldeperiodeKjede(oppdatertKjede);
                                    lukkModal();
                                }
                            });
                        }}
                    >
                        {tekster.start}
                    </Button>
                }
            >
                {tekster.modalTekst}
            </BekreftelsesModal>
        </div>
    );
};

const teksterForType = {
    [MeldekortbehandlingType.FØRSTE_BEHANDLING]: {
        start: 'Start behandling',
        kanIkkeStarte: 'Kan ikke starte behandling av meldekortet',
        modalTittel: 'Start behandling av meldekortet',
        modalTekst: 'Vil du starte behandling av dette meldekortet?',
    },
    [MeldekortbehandlingType.KORRIGERING]: {
        start: 'Start korrigering',
        kanIkkeStarte: 'Kan ikke starte korrigering av meldekortet',
        modalTittel: 'Start korrigering av meldekortet',
        modalTekst: 'Vil du starte korrigering av dette meldekortet?',
    },
} as const satisfies Record<MeldekortbehandlingType, Record<string, string>>;
