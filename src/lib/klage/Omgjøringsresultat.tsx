import { VStack, InfoCard, Button, HStack } from '@navikt/ds-react';
import Link from 'next/link';
import { useState } from 'react';
import { Klagebehandling, KlagebehandlingsresultatOmgjør } from '~/lib/klage/typer/Klage';
import { Rammebehandling, RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { Søknad } from '~/types/Søknad';
import {
    erKlageVedtatt,
    erKlageFerdigstilt,
    erKlageAvsluttet,
    erKlagebehandlingSattPåVent,
    erKlageÅpen,
} from '~/lib/klage/utils/klageUtils';
import { behandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import { VelgOmgjøringsbehandlingModal } from '~/lib/klage/forms/velg-omgjøringsbehandling/VelgOmgjøringsbehandlingForm';
import FerdigstillKlageModalWrapper from './modaler/FerdigstillKlagebehandlingModal';
import KlageTilknyttedeBehandlingerInfoCard from './KlageTilknyttedeBehandlingerInfoCard';
import {
    erBehandlingIdMeldekortbehandling,
    erBehandlingIdRammebehandling,
} from '../behandling-felles/utils/behandlingUtils';
import { MeldekortbehandlingId } from '../meldekort/typer/Meldekortbehandling';
import { Meldekortvedtak } from '../meldekort/typer/Meldekortvedtak';
import { Nullable, PartialRecord } from '~/types/UtilTypes';
import { MeldekortbehandlingPropsV2 } from '../meldekort/v2/typer';
import { MeldeperiodeKjedeProps } from '../meldekort/typer/Meldeperiode';

const Omgjøringsresultat = (props: {
    klage: Klagebehandling & { resultat: KlagebehandlingsresultatOmgjør };
    rammevedtak: Rammevedtak[];
    meldekortvedtak: Meldekortvedtak[];
    meldeperiodekjeder: MeldeperiodeKjedeProps[];
    søknader: Søknad[];
    rammebehandlinger: Rammebehandling[];
    meldekortbehandlinger: PartialRecord<MeldekortbehandlingId, MeldekortbehandlingPropsV2>;
    innloggetSaksbehandler: Saksbehandler;
}) => {
    return (
        <VStack align="start" gap="space-16" maxWidth="30rem">
            <OmgjøringsresultatInfo klage={props.klage} />
            <KlageTilknyttedeBehandlingerInfoCard
                klage={props.klage}
                rammebehandlinger={props.rammebehandlinger}
                meldekortbehandlinger={props.meldekortbehandlinger}
            />
            <KlageOmgjøringsbehandlingAksjoner
                klage={props.klage}
                innloggetSaksbehandler={props.innloggetSaksbehandler}
                rammevedtak={props.rammevedtak}
                søknader={props.søknader}
                meldekortvedtak={props.meldekortvedtak}
                meldeperiodekjeder={props.meldeperiodekjeder}
                omgjøringsbehandling={
                    props.meldekortbehandlinger[
                        props.klage.åpenBehandlingId as MeldekortbehandlingId
                    ] ??
                    props.rammebehandlinger.find((b) => b.id === props.klage.åpenBehandlingId) ??
                    null
                }
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
        const harTilknyttetBehandling = props.klage.tilknyttedeBehandlingIder.length > 0;

        const harÅpenBehandling = !!props.klage.åpenBehandlingId;

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
    innloggetSaksbehandler: Saksbehandler;
    rammevedtak: Rammevedtak[];
    søknader: Søknad[];
    meldekortvedtak: Meldekortvedtak[];
    meldeperiodekjeder: MeldeperiodeKjedeProps[];
    omgjøringsbehandling: Nullable<MeldekortbehandlingPropsV2 | Rammebehandling>;
}) => {
    const erReadonlyForSaksbehandler =
        props.innloggetSaksbehandler.navIdent !== props.klage.saksbehandler;
    const harÅpenBehandling = !!props.klage.åpenBehandlingId;
    const klagerPåRammebehandling =
        harÅpenBehandling && erBehandlingIdRammebehandling(props.klage.åpenBehandlingId!);
    const klagerPåMeldekortbehandling =
        harÅpenBehandling && erBehandlingIdMeldekortbehandling(props.klage.åpenBehandlingId!);

    const [vilVelgeOmgjøringsbehandlingModal, setVilVelgeOmgjøringsbehandlingModal] =
        useState(false);

    return (
        <div>
            {harÅpenBehandling ? (
                <>
                    {klagerPåRammebehandling && (
                        <Button
                            as={Link}
                            variant="secondary"
                            href={behandlingUrl({
                                saksnummer: props.klage.saksnummer,
                                id: props.klage.åpenBehandlingId as RammebehandlingId,
                            })}
                        >
                            Gå til omgjøringsbehandling
                        </Button>
                    )}
                    {klagerPåMeldekortbehandling && (
                        <Button
                            as={Link}
                            variant="secondary"
                            href={meldeperiodeUrl(
                                props.klage.saksnummer,
                                (props.omgjøringsbehandling as MeldekortbehandlingPropsV2).periode,
                            )}
                        >
                            Gå til omgjøringsbehandling
                        </Button>
                    )}
                </>
            ) : (
                <HStack gap="space-16">
                    {!erKlageVedtatt(props.klage) &&
                        !erKlagebehandlingSattPåVent(props.klage) &&
                        erKlageÅpen(props.klage) && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setVilVelgeOmgjøringsbehandlingModal(true)}
                            >
                                Opprett ny behandling
                            </Button>
                        )}
                    {!erKlageAvsluttet(props.klage) &&
                        !erReadonlyForSaksbehandler &&
                        !erKlagebehandlingSattPåVent(props.klage) && (
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
                    klagebehandling={props.klage}
                    rammevedtak={props.rammevedtak}
                    søknader={props.søknader}
                    meldekortvedtak={props.meldekortvedtak}
                    meldeperiodekjeder={props.meldeperiodekjeder}
                    åpen={vilVelgeOmgjøringsbehandlingModal}
                    onClose={() => setVilVelgeOmgjøringsbehandlingModal(false)}
                />
            )}
        </div>
    );
};
