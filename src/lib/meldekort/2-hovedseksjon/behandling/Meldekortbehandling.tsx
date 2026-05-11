import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import {
    erMeldekortbehandlingSattPaVent,
    kanBeslutteForMeldekort,
    kanSaksbehandleForMeldekort,
    skalKunneGjenopptaMeldekortbehandling,
} from '~/lib/meldekort/utils/MeldekortbehandlingUtils';
import { MeldekortUtfylling } from './utfylling/MeldekortUtfylling';
import { MeldekortOppsummering } from '../../0-felles-komponenter/meldekort-oppsummering/MeldekortOppsummering';
import { MeldekortTaBeslutning } from './beslutning/MeldekortTaBeslutning';
import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
    MeldekortbehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';

import style from './Meldekortbehandling.module.css';
import Divider from '~/lib/_felles/divider/Divider';
import OppsummeringAvVentestatus from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatus';
import { OppsummeringAvVentestatuserModal } from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatuser';
import { useMeldeperiodeKjede } from '~/lib/meldekort/context/MeldeperiodeKjedeContext';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { useRef } from 'react';
import { oppdaterMeldeperiodeKjedeMedMeldekortbehandling } from '~/lib/meldekort/utils/MeldekortbehandlingUtils';
import { useGjenopptaMeldekortbehandling } from '~/lib/meldekort/api/MeldekortApi';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
};

export const Meldekortbehandling = ({ meldekortbehandling }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { type, status, erAvsluttet } = meldekortbehandling;
    const sisteVentestatus = meldekortbehandling.ventestatus.at(-1);
    const erSattPåVent = erMeldekortbehandlingSattPaVent(meldekortbehandling);
    const kanGjenoppta = skalKunneGjenopptaMeldekortbehandling(
        meldekortbehandling,
        innloggetSaksbehandler,
    );

    return (
        <VStack gap={'space-20'}>
            <div className={style.toppRad}>
                <Heading level={'3'} size={'medium'}>
                    {erAvsluttet ? 'Siste behandling' : 'Pågående behandling'}
                </Heading>
                {type === MeldekortbehandlingType.KORRIGERING && (
                    <Alert variant={'info'} inline={true} size={'small'}>
                        {'Korrigering'}
                    </Alert>
                )}
                {status === MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET && (
                    <Alert variant={'info'} inline={true} size={'small'}>
                        {'Automatisk behandlet'}
                    </Alert>
                )}
            </div>
            {erSattPåVent && sisteVentestatus ? (
                <>
                    <OppsummeringAvVentestatus
                        ventestatus={sisteVentestatus}
                        medHistorikkVisning={
                            meldekortbehandling.ventestatus.length > 0
                                ? () => (
                                      <OppsummeringAvVentestatuserModal
                                          ventestatuser={meldekortbehandling.ventestatus}
                                          button={{ variant: 'tertiary' }}
                                      />
                                  )
                                : undefined
                        }
                    />
                    <MeldekortOppsummering meldekortbehandling={meldekortbehandling} />
                    {kanGjenoppta && (
                        <MeldekortbehandlingGjenoppta meldekortbehandling={meldekortbehandling} />
                    )}
                </>
            ) : kanSaksbehandleForMeldekort(meldekortbehandling, innloggetSaksbehandler) ? (
                <MeldekortUtfylling meldekortbehandling={meldekortbehandling} />
            ) : (
                <>
                    <MeldekortOppsummering meldekortbehandling={meldekortbehandling} />
                    <Divider orientation="horizontal" />
                    <HStack gap="space-8" align="end">
                        {meldekortbehandling.ventestatus.length > 0 && (
                            <OppsummeringAvVentestatuserModal
                                ventestatuser={meldekortbehandling.ventestatus}
                                button={{ variant: 'tertiary' }}
                            />
                        )}
                        {kanBeslutteForMeldekort(meldekortbehandling, innloggetSaksbehandler) && (
                            <MeldekortTaBeslutning meldekortbehandling={meldekortbehandling} />
                        )}
                    </HStack>
                </>
            )}
        </VStack>
    );
};

const MeldekortbehandlingGjenoppta = (props: { meldekortbehandling: MeldekortbehandlingProps }) => {
    const { meldeperiodeKjede, setMeldeperiodeKjede } = useMeldeperiodeKjede();
    const modalRef = useRef<HTMLDialogElement>(null);

    const gjenopptaMeldekortbehandling = useGjenopptaMeldekortbehandling({
        sakId: props.meldekortbehandling.sakId,
        meldekortbehandlingId: props.meldekortbehandling.id,
        onSuccess: (oppdatertMeldekortbehandling) => {
            setMeldeperiodeKjede(
                oppdaterMeldeperiodeKjedeMedMeldekortbehandling(
                    meldeperiodeKjede,
                    oppdatertMeldekortbehandling,
                ),
            );
            lukkModal();
        },
    });

    const lukkModal = () => modalRef.current?.close();

    return (
        <div>
            <Button size="small" type="button" onClick={() => modalRef.current?.showModal()}>
                Gjenoppta behandling
            </Button>
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Gjenoppta behandling?'}
                feil={gjenopptaMeldekortbehandling.error}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        size="small"
                        loading={gjenopptaMeldekortbehandling.isMutating}
                        onClick={(e) => {
                            e.preventDefault();
                            gjenopptaMeldekortbehandling.trigger();
                        }}
                    >
                        Gjenoppta behandling
                    </Button>
                }
            />
        </div>
    );
};
