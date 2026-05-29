import { BodyShort, InfoCard } from '@navikt/ds-react';
import Link from 'next/link';
import { Klagebehandling } from '~/lib/klage/typer/Klage';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { formaterTidspunktKort } from '~/utils/date';
import { finnBehandlingstypeTekst, behandlingResultatTilText } from '~/utils/tekstformateringUtils';
import { behandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingPropsV2,
} from '../meldekort/typer/Meldekortbehandling';
import { PartialRecord } from '~/types/UtilTypes';
import { erBehandlingIdMeldekortbehandling } from '../behandling-felles/utils/BehandlingUtils';

const KlageTilknyttedeBehandlingerInfoCard = (props: {
    klage: Klagebehandling;
    rammebehandlinger: Rammebehandling[];
    meldekortbehandlinger: PartialRecord<MeldekortbehandlingId, MeldekortbehandlingPropsV2>;
}) => {
    const tilknyttedeIkkeÅpneBehandlinger = props.klage.tilknyttedeBehandlingIder.filter(
        (id) => id !== props.klage.åpenBehandlingId,
    );

    return (
        <div>
            {tilknyttedeIkkeÅpneBehandlinger.length > 0 && (
                <InfoCard data-color="success">
                    <InfoCard.Header>
                        <InfoCard.Title>Tilknyttede behandlinger</InfoCard.Title>
                    </InfoCard.Header>
                    <InfoCard.Content>
                        <BodyShort>Ferdige behandlinger som er knyttet til klagen:</BodyShort>

                        {tilknyttedeIkkeÅpneBehandlinger.map((id) => {
                            const rammebehandling = props.rammebehandlinger.find(
                                (b) => b.id === id,
                            )!;
                            const meldekortbehandling = erBehandlingIdMeldekortbehandling(id)
                                ? props.meldekortbehandlinger[id as MeldekortbehandlingId]
                                : null;

                            if (rammebehandling) {
                                return (
                                    <div key={id}>
                                        <Link
                                            href={behandlingUrl({
                                                saksnummer: props.klage.saksnummer,
                                                id: rammebehandling.id,
                                            })}
                                        >
                                            {finnBehandlingstypeTekst[rammebehandling.type]} -{' '}
                                            {behandlingResultatTilText[rammebehandling.resultat]} -{' '}
                                            {formaterTidspunktKort(rammebehandling.opprettet)}
                                        </Link>
                                    </div>
                                );
                            }

                            if (meldekortbehandling) {
                                return (
                                    <div key={id}>
                                        <Link
                                            href={meldeperiodeUrl(
                                                props.klage.saksnummer,
                                                meldekortbehandling.periode,
                                            )}
                                        >
                                            Meldekortbehandling - {meldekortbehandling.status} -{' '}
                                            {formaterTidspunktKort(meldekortbehandling.opprettet)}
                                        </Link>
                                    </div>
                                );
                            }

                            return null;
                        })}
                    </InfoCard.Content>
                </InfoCard>
            )}
        </div>
    );
};

export default KlageTilknyttedeBehandlingerInfoCard;
