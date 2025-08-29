import React from 'react';
import { Button, HStack, Select, VStack } from '@navikt/ds-react';
import {
    BehandlingssammendragBenktype,
    BehandlingssammendragStatus,
    BehandlingssammendragType,
    BenkOversiktResponse,
} from '~/types/Behandlingssammendrag';
import {
    behandlingsstatusTextFormatter,
    behandlingstypeTextFormatter,
} from '~/components/benk/BenkSideUtils';
import { Saksbehandler } from '~/types/Saksbehandler';

type Filters = {
    benktype: BehandlingssammendragBenktype | 'Alle';
    type: BehandlingssammendragType | 'Alle';
    status: BehandlingssammendragStatus | 'Alle';
    saksbehandler: string | 'Alle' | 'IKKE_TILDELT';
};

type Props = {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    benkOversikt: BenkOversiktResponse;
    innloggetSaksbehandler: Saksbehandler;
    onOppdaterFilter: () => void;
    onNullstillFilter: () => void;
};

const BenkFilter = ({
    filters,
    setFilters,
    benkOversikt,
    innloggetSaksbehandler,
    onOppdaterFilter,
    onNullstillFilter,
}: Props) => (
    <VStack gap="4">
        <HStack gap="4">
            <Select
                label="Benk"
                size="small"
                value={filters.benktype}
                onChange={(e) =>
                    setFilters((prev) => ({
                        ...prev,
                        benktype: e.target.value as BehandlingssammendragBenktype,
                    }))
                }
            >
                <option value={'Alle'}>Alle</option>
                <option value={BehandlingssammendragBenktype.KLAR}>Klar</option>
                <option value={BehandlingssammendragBenktype.VENTER}>Venter</option>
            </Select>
            <Select
                label="Type"
                size="small"
                value={filters.type}
                onChange={(e) =>
                    setFilters((prev) => ({
                        ...prev,
                        type: e.target.value as BehandlingssammendragType | 'Alle',
                    }))
                }
            >
                <option value="Alle">Alle</option>
                {Object.entries(BehandlingssammendragType).map(([key, value]) => (
                    <option key={key} value={value}>
                        {behandlingstypeTextFormatter[value]}
                    </option>
                ))}
            </Select>
            <Select
                label="Status"
                size="small"
                value={filters.status}
                onChange={(e) =>
                    setFilters((prev) => ({
                        ...prev,
                        status: e.target.value as BehandlingssammendragStatus | 'Alle',
                    }))
                }
            >
                <option value="Alle">Alle</option>
                {Object.values(BehandlingssammendragStatus).map((status) => (
                    <option key={status} value={status}>
                        {behandlingsstatusTextFormatter[status]}
                    </option>
                ))}
            </Select>
            <Select
                label="Saksbehandler/Beslutter"
                size="small"
                value={filters.saksbehandler}
                onChange={(e) => setFilters((prev) => ({ ...prev, saksbehandler: e.target.value }))}
            >
                <option value="Alle">Alle</option>
                <option value="IKKE_TILDELT">Ikke tildelt</option>
                {benkOversikt.behandlingssammendrag
                    .map((behandling) => behandling.saksbehandler)
                    .filter((value, index, self) => value && self.indexOf(value) === index)
                    .map((saksbehandler) => (
                        <option key={saksbehandler} value={saksbehandler!}>
                            {innloggetSaksbehandler.navIdent === saksbehandler
                                ? 'Meg'
                                : saksbehandler}
                        </option>
                    ))}
            </Select>
        </HStack>
        <HStack gap="4">
            <Button type="button" size="small" onClick={onOppdaterFilter}>
                Oppdater filtre
            </Button>
            <Button type="button" size="small" variant="secondary" onClick={onNullstillFilter}>
                Nullstill filtre
            </Button>
        </HStack>
    </VStack>
);

export default BenkFilter;
