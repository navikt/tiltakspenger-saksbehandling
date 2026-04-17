import { BodyShort, InfoCard } from '@navikt/ds-react';
import Link from 'next/link';
import { Klagebehandling } from '~/types/Klage';
import { Rammebehandling } from '~/types/Rammebehandling';
import { formaterTidspunktKort } from '~/utils/date';
import { finnBehandlingstypeTekst, behandlingResultatTilText } from '~/utils/tekstformateringUtils';
import { behandlingUrl } from '~/utils/urls';

const KlageTilknyttedeBehandlingerInfoCard = (props: {
    klage: Klagebehandling;
    rammebehandlinger: Rammebehandling[];
}) => {
    const tilknyttedeIkkeÅpneBehandlinger = props.klage.tilknyttedeRammebehandlingIder.filter(
        (id) => id !== props.klage.åpenRammebehandlingId,
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
                            return (
                                <div key={id}>
                                    <Link
                                        href={behandlingUrl({
                                            saksnummer: props.klage.saksnummer,
                                            id,
                                        })}
                                    >
                                        {finnBehandlingstypeTekst[rammebehandling.type]} -{' '}
                                        {behandlingResultatTilText[rammebehandling.resultat]} -{' '}
                                        {formaterTidspunktKort(rammebehandling.opprettet)}
                                    </Link>
                                </div>
                            );
                        })}
                    </InfoCard.Content>
                </InfoCard>
            )}
        </div>
    );
};

export default KlageTilknyttedeBehandlingerInfoCard;
