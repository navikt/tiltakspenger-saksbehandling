import { VStack, InfoCard, Button, HStack } from '@navikt/ds-react';
import Link from 'next/link';
import { useState } from 'react';
import { Klagebehandling, KlagebehandlingsresultatOmgjør } from '~/lib/klage/typer/Klage';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';
import { SaksbehandlerTyper } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { Søknad } from '~/types/Søknad';
import { erKlageVedtatt, erKlageFerdigstilt, erKlageAvsluttet } from '~/lib/klage/utils/klageUtils';
import { behandlingUrl } from '~/utils/urls';
import { VelgOmgjøringsbehandlingModal } from '~/lib/klage/forms/velg-omgjøringsbehandling/VelgOmgjøringsbehandlingForm';
import FerdigstillKlageModalWrapper from './modaler/FerdigstillKlagebehandlingModal';
import KlageTilknyttedeBehandlingerInfoCard from './KlageTilknyttedeBehandlingerInfoCard';

const Omgjøringsresultat = (props: {
    klage: Klagebehandling & { resultat: KlagebehandlingsresultatOmgjør };
    vedtak: Rammevedtak[];
    søknader: Søknad[];
    rammebehandlinger: Rammebehandling[];
    innloggetSaksbehandler: SaksbehandlerTyper;
}) => {
    return (
        <VStack align="start" gap="space-16" maxWidth="30rem">
            <OmgjøringsresultatInfo klage={props.klage} />
            <KlageTilknyttedeBehandlingerInfoCard
                klage={props.klage}
                rammebehandlinger={props.rammebehandlinger}
            />
            <KlageOmgjøringsbehandlingAksjoner
                klage={props.klage}
                innloggetSaksbehandler={props.innloggetSaksbehandler}
                vedtak={props.vedtak}
                søknader={props.søknader}
            />
        </VStack>
    );
};

export default Omgjøringsresultat;

/**
 * basert på ulike situasjoner, har vi lyst til å informere om ulike ting.
    - Hvis klagen ikke er ferdigstilt / vedtatt. Informere om resultatet
    - Hvis klagen er vedtatt, si at klagen er blitt vedtatt og link til åpen behandling
    - Hvis klagen er ferdigstilt - informere om det finnes tilknyttede behandlinger eller ikke   
 */
const OmgjøringsresultatInfo = (props: {
    klage: Klagebehandling & { resultat: KlagebehandlingsresultatOmgjør };
}) => {
    const erKlagenVedtatt = erKlageVedtatt(props.klage);
    const erKlagenFerdigstilt = erKlageFerdigstilt(props.klage);

    if (erKlagenVedtatt) {
        return (
            <InfoCard data-color="success">
                <InfoCard.Header>
                    <InfoCard.Title>Klagen er vedtatt</InfoCard.Title>
                </InfoCard.Header>
                <InfoCard.Content>
                    Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres. Det er
                    opprettet en omgjøringsbehandling for klagen, og klagen er vedtatt.
                </InfoCard.Content>
            </InfoCard>
        );
    }

    if (erKlagenFerdigstilt) {
        const harTilknyttetBehandling = props.klage.tilknyttedeRammebehandlingIder.length > 0;

        const harÅpenBehandling = !!props.klage.åpenRammebehandlingId;

        return (
            <InfoCard data-color="success">
                <InfoCard.Header>
                    <InfoCard.Title>Klagen er ferdigstilt</InfoCard.Title>
                </InfoCard.Header>
                <InfoCard.Content>
                    {harTilknyttetBehandling
                        ? `Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres. Klagen er ferdigstilt, og har tilknyttede behandlinger. ${harÅpenBehandling ? 'Klagen har også en åpen behandling.' : ''}`
                        : 'Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres. Klagen er ferdigstilt uten en tilknyttet behandling. Se begrunnelse.'}
                </InfoCard.Content>
            </InfoCard>
        );
    }

    return (
        <InfoCard data-color="meta-purple">
            <InfoCard.Header>
                <InfoCard.Title>Omgjøring av vedtak</InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>
                Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres.
                Klagebehandlingen blir automatisk ferdigstilt etter omgjøringsbehandlingen er
                iverksatt.
            </InfoCard.Content>
        </InfoCard>
    );
};

const KlageOmgjøringsbehandlingAksjoner = (props: {
    klage: Klagebehandling;
    innloggetSaksbehandler: SaksbehandlerTyper;
    vedtak: Rammevedtak[];
    søknader: Søknad[];
}) => {
    const erReadonlyForSaksbehandler =
        props.innloggetSaksbehandler.navIdent !== props.klage.saksbehandler;
    const harÅpenBehandling = !!props.klage.åpenRammebehandlingId;

    const [vilVelgeOmgjøringsbehandlingModal, setVilVelgeOmgjøringsbehandlingModal] =
        useState(false);

    return (
        <div>
            {harÅpenBehandling ? (
                <Button
                    as={Link}
                    variant="secondary"
                    href={behandlingUrl({
                        saksnummer: props.klage.saksnummer,
                        id: props.klage.åpenRammebehandlingId!,
                    })}
                >
                    Gå til omgjøringsbehandling
                </Button>
            ) : (
                <HStack gap="space-16">
                    {!erKlageVedtatt(props.klage) && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setVilVelgeOmgjøringsbehandlingModal(true)}
                        >
                            Opprett ny behandling
                        </Button>
                    )}
                    {!erKlageAvsluttet(props.klage) && !erReadonlyForSaksbehandler && (
                        <FerdigstillKlageModalWrapper
                            sakId={props.klage.sakId}
                            klageId={props.klage.id}
                        />
                    )}
                </HStack>
            )}

            {vilVelgeOmgjøringsbehandlingModal && (
                <VelgOmgjøringsbehandlingModal
                    sakId={props.klage.sakId}
                    saksnummer={props.klage.saksnummer}
                    klageId={props.klage.id}
                    vedtak={props.vedtak}
                    søknader={props.søknader}
                    åpen={vilVelgeOmgjøringsbehandlingModal}
                    onClose={() => setVilVelgeOmgjøringsbehandlingModal(false)}
                />
            )}
        </div>
    );
};
