import { Alert, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import {
    erMeldekortbehandlingSattPaVent,
    kanBeslutteForMeldekort,
    kanSaksbehandleForMeldekort,
    skalKunneGjenopptaMeldekortbehandling,
    skalKunneSetteMeldekortbehandlingPaVent,
} from '~/lib/meldekort/utils/MeldekortbehandlingUtils';
import { MeldekortUtfylling } from './utfylling/MeldekortUtfylling';
import { MeldekortOppsummering } from '../../0-felles-komponenter/meldekort-oppsummering/MeldekortOppsummering';
import { MeldekortTaBeslutning } from './beslutning/MeldekortTaBeslutning';
import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';

import style from './Meldekortbehandling.module.css';
import Divider from '~/lib/_felles/divider/Divider';
import OppsummeringAvVentestatus from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatus';
import { OppsummeringAvVentestatuserModal } from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatuser';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { useRef, useState } from 'react';
import {
    useGjenopptaMeldekortbehandling,
    useSettMeldekortbehandlingPåVent,
} from '~/lib/meldekort/api/MeldekortApi';
import SettBehandlingPåVentModal from '~/lib/_felles/modaler/SettBehandlingPåVentModal';
import { useSak } from '~/lib/sak/SakContext';
import router from 'next/router';
import { Klagebehandling } from '~/lib/klage/typer/Klage';
import { Nullable } from '~/types/UtilTypes';
import { personoversiktUrl } from '~/utils/urls';
import OppsummeringAvKlageForRammebehandling from '~/lib/behandling-felles/oppsummeringer/klage/oppsummeringAvKlageForRammebehandling/OppsummeringAvKlageForRammebehandling';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
    klagebehandling: Nullable<Klagebehandling>;
};

export const Meldekortbehandling = ({ meldekortbehandling, klagebehandling }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { type, status, erAvsluttet } = meldekortbehandling;
    const sisteVentestatus = meldekortbehandling.ventestatus.at(0);
    const erSattPåVent = erMeldekortbehandlingSattPaVent(meldekortbehandling);
    const kanGjenoppta = skalKunneGjenopptaMeldekortbehandling(
        meldekortbehandling,
        innloggetSaksbehandler,
    );
    const kanSettePåVent = skalKunneSetteMeldekortbehandlingPaVent(
        meldekortbehandling,
        innloggetSaksbehandler,
    );

    return (
        <VStack gap={'space-20'}>
            <div className={style.toppRad}>
                <Heading level={'3'} size={'medium'}>
                    {erAvsluttet ? 'Siste behandling' : 'Pågående behandling'}
                </Heading>
                {type === MeldeperiodebehandlingType.KORRIGERING && (
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
            {klagebehandling && (
                <Box borderWidth="1">
                    <OppsummeringAvKlageForRammebehandling klagebehandling={klagebehandling} />
                </Box>
            )}
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
                    <MeldekortOppsummering
                        meldekortbehandling={meldekortbehandling}
                        klagebehandling={null}
                    />
                    {kanGjenoppta && (
                        <MeldekortbehandlingGjenoppta meldekortbehandling={meldekortbehandling} />
                    )}
                </>
            ) : kanSaksbehandleForMeldekort(meldekortbehandling, innloggetSaksbehandler) ? (
                <MeldekortUtfylling meldekortbehandling={meldekortbehandling} />
            ) : (
                <>
                    <MeldekortOppsummering
                        meldekortbehandling={meldekortbehandling}
                        klagebehandling={null}
                    />
                    <Divider orientation="horizontal" />
                    <VStack gap="space-16">
                        <HStack gap="space-8" align="end">
                            {meldekortbehandling.ventestatus.length > 0 && (
                                <OppsummeringAvVentestatuserModal
                                    ventestatuser={meldekortbehandling.ventestatus}
                                    button={{ variant: 'tertiary' }}
                                />
                            )}
                            {kanSettePåVent && (
                                <MeldekortbehandlingSettPåVent
                                    meldekortbehandling={meldekortbehandling}
                                />
                            )}
                        </HStack>
                        <HStack justify="end">
                            {kanBeslutteForMeldekort(
                                meldekortbehandling,
                                innloggetSaksbehandler,
                            ) && (
                                <MeldekortTaBeslutning meldekortbehandling={meldekortbehandling} />
                            )}
                        </HStack>
                    </VStack>
                </>
            )}
        </VStack>
    );
};

const MeldekortbehandlingSettPåVent = (props: {
    meldekortbehandling: MeldekortbehandlingProps;
}) => {
    const { setSak } = useSak();
    const [visSettPåVentModal, setVisSettPåVentModal] = useState(false);

    const settMeldekortbehandlingPåVent = useSettMeldekortbehandlingPåVent({
        sakId: props.meldekortbehandling.sakId,
        meldekortbehandlingId: props.meldekortbehandling.id,
        onSuccess: (oppdatertSak) => {
            setSak(oppdatertSak);
            router.push(personoversiktUrl(oppdatertSak.saksnummer));
        },
    });

    return (
        <>
            <Button
                type="button"
                variant="tertiary"
                size="small"
                onClick={() => setVisSettPåVentModal(true)}
            >
                Sett på vent
            </Button>
            {visSettPåVentModal && (
                <SettBehandlingPåVentModal
                    åpen={visSettPåVentModal}
                    onClose={() => setVisSettPåVentModal(false)}
                    api={{
                        trigger: (begrunnelse, frist) => {
                            settMeldekortbehandlingPåVent.trigger({ begrunnelse, frist });
                        },
                        isMutating: settMeldekortbehandlingPåVent.isMutating,
                        error: settMeldekortbehandlingPåVent.error ?? null,
                    }}
                />
            )}
        </>
    );
};

const MeldekortbehandlingGjenoppta = (props: { meldekortbehandling: MeldekortbehandlingProps }) => {
    const { setSak } = useSak();
    const modalRef = useRef<HTMLDialogElement>(null);

    const gjenopptaMeldekortbehandling = useGjenopptaMeldekortbehandling({
        sakId: props.meldekortbehandling.sakId,
        meldekortbehandlingId: props.meldekortbehandling.id,
        onSuccess: (response) => {
            if (response) {
                setSak(response);
                lukkModal();
            }
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
