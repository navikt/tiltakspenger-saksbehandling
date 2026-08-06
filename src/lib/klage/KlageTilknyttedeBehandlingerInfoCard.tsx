import { BodyShort, InfoCard } from '@navikt/ds-react';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { Klagebehandling } from '~/lib/klage/typer/Klage';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { formaterTidspunktKort } from '~/utils/date';
import { behandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '../meldekort/typer/Meldekortbehandling';
import { PartialRecord } from '~/types/UtilTypes';
import { erBehandlingIdMeldekortbehandling } from '../behandling-felles/utils/behandlingUtils';
import {
    rammebehandlingResultatTekst,
    rammebehandlingstypeTekst,
} from '~/lib/rammebehandling/utils/rammebehandlingTekster';

const KlageTilknyttedeBehandlingerInfoCard = (props: {
    klage: Klagebehandling;
    rammebehandlinger: Rammebehandling[];
    meldekortbehandlinger: PartialRecord<MeldekortbehandlingId, MeldekortbehandlingProps>;
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
                            );
                            const meldekortbehandling = erBehandlingIdMeldekortbehandling(id)
                                ? props.meldekortbehandlinger[id as MeldekortbehandlingId]
                                : null;

                            if (rammebehandling) {
                                return (
                                    <div key={id}>
                                        <InternLenke
                                            href={behandlingUrl({
                                                saksnummer: props.klage.saksnummer,
                                                id: rammebehandling.id,
                                            })}
                                        >
                                            {rammebehandlingstypeTekst[rammebehandling.type]} -{' '}
                                            {rammebehandlingResultatTekst[rammebehandling.resultat]}{' '}
                                            - {formaterTidspunktKort(rammebehandling.opprettet)}
                                        </InternLenke>
                                    </div>
                                );
                            }

                            if (meldekortbehandling) {
                                return (
                                    <div key={id}>
                                        <InternLenke
                                            href={meldeperiodeUrl(
                                                props.klage.saksnummer,
                                                meldekortbehandling.periode,
                                            )}
                                        >
                                            Meldekortbehandling - {meldekortbehandling.status} -{' '}
                                            {formaterTidspunktKort(meldekortbehandling.opprettet)}
                                        </InternLenke>
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
