import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { BehandlingId } from '../typer/BehandlingFelles';
import {
    RammebehandlingId,
    RammebehandlingIdPrefix,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { VentestatusHendelse } from '~/lib/behandling-felles/typer/Ventestatus';
import { Attestering, Attesteringsstatus } from '~/lib/behandling-felles/typer/Attestering';
import { MeldekortIdPrefix } from '~/lib/meldekort/typer/MeldekortId';

export const erRammebehandlingId = (id: BehandlingId): id is RammebehandlingId =>
    id.startsWith(RammebehandlingIdPrefix);

export const erMeldekortId = (id: BehandlingId): id is MeldekortbehandlingId =>
    id.startsWith(MeldekortIdPrefix);

type MedVentestatus = { ventestatus: VentestatusHendelse[] };

export const erBehandlingSattPåVent = ({ ventestatus }: MedVentestatus): boolean => {
    return ventestatus.at(0)?.erSattPåVent ?? false;
};

type MedAttesteringer = { attesteringer: Attestering[] };

export const erBehandlingUnderkjent = ({ attesteringer }: MedAttesteringer) => {
    return attesteringer.at(-1)?.status === Attesteringsstatus.SENDT_TILBAKE;
};
