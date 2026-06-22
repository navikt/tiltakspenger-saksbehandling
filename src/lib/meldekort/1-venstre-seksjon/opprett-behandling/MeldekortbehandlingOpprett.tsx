import { Alert, Button, Loader, Link } from '@navikt/ds-react';
import { useOpprettMeldekortbehandling } from './useOpprettMeldekortbehandling';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { useRef } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldeperiodeKjede } from '../../context/MeldeperiodeKjedeContext';
import { MeldeperiodebehandlingType } from '~/lib/meldekort/typer/Meldekortbehandling';
import NextLink from 'next/link';
import { meldeperiodeUrl } from '~/utils/urls';
import { formaterPeriode } from '~/utils/date';

import styles from './MeldekortbehandlingOpprett.module.css';

type Props = {
    type: MeldeperiodebehandlingType;
};

export const MeldekortbehandlingOpprett = ({ type }: Props) => {
    const { sak, setSak } = useSak();
    const { sakId, saksnummer } = sak;
    const { meldeperiodeKjede } = useMeldeperiodeKjede();

    const { id: kjedeId, periodeMedÅpenBehandling, sisteMeldeperiode } = meldeperiodeKjede;

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
            {sisteMeldeperiode.ingenDagerGirRett && (
                <Alert variant={'info'} className={styles.varsel}>
                    {
                        'Ikke rett til tiltakspenger for denne perioden. Behandlinger kan kun avsluttes.'
                    }
                </Alert>
            )}
            {periodeMedÅpenBehandling &&
                periodeMedÅpenBehandling.fraOgMed !== meldeperiodeKjede.periode.fraOgMed &&
                periodeMedÅpenBehandling.tilOgMed !== meldeperiodeKjede.periode.tilOgMed && (
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
                            {formaterPeriode(periodeMedÅpenBehandling)}
                        </Link>
                    </Alert>
                )}
            <Button
                disabled={
                    !!periodeMedÅpenBehandling &&
                    periodeMedÅpenBehandling.fraOgMed !== meldeperiodeKjede.periode.fraOgMed &&
                    periodeMedÅpenBehandling.tilOgMed !== meldeperiodeKjede.periode.tilOgMed
                }
                onClick={() => modalRef.current?.showModal()}
                className={styles.knapp}
            >
                {tekster.start}
            </Button>

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
                            opprett().then((oppdatertSak) => {
                                if (oppdatertSak) {
                                    setSak(oppdatertSak);
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
    [MeldeperiodebehandlingType.FØRSTE_BEHANDLING]: {
        start: 'Start behandling',
        kanIkkeStarte: 'Kan ikke starte behandling av meldekortet',
        modalTittel: 'Start behandling av meldekortet',
        modalTekst: 'Vil du starte behandling av dette meldekortet?',
    },
    [MeldeperiodebehandlingType.KORRIGERING]: {
        start: 'Start korrigering',
        kanIkkeStarte: 'Kan ikke starte korrigering av meldekortet',
        modalTittel: 'Start korrigering av meldekortet',
        modalTekst: 'Vil du starte korrigering av dette meldekortet?',
    },
} as const satisfies Record<MeldeperiodebehandlingType, Record<string, string>>;
