import React, { useMemo } from 'react';
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
import { BenkFilters } from './BenkSide';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';

type Props = {
    filters: BenkFilters;
    setFilters: React.Dispatch<React.SetStateAction<BenkFilters>>;
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
}: Props) => {
    const featureToggle = useFeatureToggles();

    const sortedSaksbehandlere = useMemo(() => {
        return benkOversikt.behandlingssammendrag
            .flatMap((behandling) => [behandling.saksbehandler, behandling.beslutter])
            .filter((value, index, self) => value && self.indexOf(value) === index)
            .sort((a, b) => {
                if (a === innloggetSaksbehandler.navIdent) return -1;
                if (b === innloggetSaksbehandler.navIdent) return 1;
                return a!.localeCompare(b!);
            });
    }, [benkOversikt.behandlingssammendrag, innloggetSaksbehandler.navIdent]);

    return (
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
                    {Object.entries(BehandlingssammendragType)
                        .filter(
                            (k) =>
                                k[1] !== BehandlingssammendragType.KLAGEBEHANDLING ||
                                (featureToggle.klageToggle &&
                                    k[1] === BehandlingssammendragType.KLAGEBEHANDLING),
                        )
                        .map(([key, value]) => (
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
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, saksbehandler: e.target.value }))
                    }
                >
                    <option value="Alle">Alle</option>
                    <option value="IKKE_TILDELT">Ikke tildelt</option>
                    {sortedSaksbehandlere.map((saksbehandlerEllerBeslutter) => (
                        <option
                            key={saksbehandlerEllerBeslutter}
                            value={saksbehandlerEllerBeslutter!}
                        >
                            {innloggetSaksbehandler.navIdent === saksbehandlerEllerBeslutter
                                ? 'Meg'
                                : saksbehandlerEllerBeslutter}
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
};

export default BenkFilter;
