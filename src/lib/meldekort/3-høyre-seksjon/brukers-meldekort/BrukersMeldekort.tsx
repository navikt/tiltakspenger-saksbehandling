import {
    BrukersMeldekortDagProps,
    BrukersMeldekortProps,
} from '~/types/meldekort/BrukersMeldekort';
import { BodyShort, Box, Button, HStack, Table, VStack } from '@navikt/ds-react';
import { formaterDatotekst, formaterTidspunkt, ukedagFraDatotekst } from '~/utils/date';
import { ikonForBrukersMeldekortDagStatus } from '../../0-felles-komponenter/MeldekortIkoner';
import { brukersMeldekortDagStatusTekst } from '~/utils/tekstformateringUtils';
import { BrukersMeldekortAutomatiskBehandlingStatus } from '~/lib/meldekort/3-høyre-seksjon/brukers-meldekort/automatisk-behandling-status/BrukersMeldekortAutomatiskBehandlingStatus';
import { useMeldekortbehandlingForm } from '~/lib/meldekort/context/MeldekortUtfyllingFormContext';
import { ChevronLeftDoubleIcon } from '@navikt/aksel-icons';
import { useMeldeperiodeKjede } from '~/lib/meldekort/context/MeldeperiodeKjedeContext';
import { hentMeldekortForhåndsutfyllingFraBrukersMeldekort } from '~/lib/meldekort/0-felles-komponenter/meldekortForhåndsutfyllingUtils';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { kanSaksbehandleForMeldekort } from '~/utils/tilganger';

import styles from './BrukersMeldekort.module.css';

type Props = {
    brukersMeldekort: BrukersMeldekortProps;
};

export const BrukersMeldekortVisning = ({ brukersMeldekort }: Props) => {
    const { sisteMeldeperiode, sisteMeldekortbehandling } = useMeldeperiodeKjede();
    const { innloggetSaksbehandler } = useSaksbehandler();

    const kanBehandle =
        sisteMeldekortbehandling &&
        kanSaksbehandleForMeldekort(sisteMeldekortbehandling, innloggetSaksbehandler);

    const formContext = useMeldekortbehandlingForm();

    const { dager, mottatt } = brukersMeldekort;

    const uke1 = dager.slice(0, 7);
    const uke2 = dager.slice(7, 14);

    return (
        <VStack gap={'space-4'}>
            <HStack
                gap={'space-4'}
                align={'center'}
                justify={'space-between'}
                className={styles.toppRad}
            >
                {kanBehandle && formContext && (
                    <Button
                        variant={'tertiary'}
                        size={'xsmall'}
                        icon={<ChevronLeftDoubleIcon />}
                        onClick={() =>
                            formContext.setValue(
                                'dager',
                                hentMeldekortForhåndsutfyllingFraBrukersMeldekort(
                                    brukersMeldekort,
                                    sisteMeldeperiode,
                                ),
                                {
                                    shouldDirty: true,
                                },
                            )
                        }
                    >
                        {'Fyll inn disse dagene'}
                    </Button>
                )}
                <BodyShort size={'small'}>
                    {'Mottatt fra bruker: '}
                    <strong>{formaterTidspunkt(mottatt)}</strong>
                </BodyShort>
            </HStack>
            <BrukersMeldekortAutomatiskBehandlingStatus meldekort={brukersMeldekort} />
            <Uke dager={uke1} />
            <Uke dager={uke2} />
        </VStack>
    );
};

type UkeProps = {
    dager: BrukersMeldekortDagProps[];
};

const Uke = ({ dager }: UkeProps) => {
    return (
        <Box className={styles.utbetalingsuke}>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Dag</Table.HeaderCell>
                        <Table.HeaderCell>Dato</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {dager.map((dag) => {
                        const { dato, status } = dag;

                        return (
                            <Table.Row key={dato.toString()}>
                                <Table.DataCell>{ukedagFraDatotekst(dato)}</Table.DataCell>
                                <Table.DataCell>{formaterDatotekst(dato)}</Table.DataCell>
                                <Table.DataCell>
                                    <HStack align="center" gap="space-12" wrap={false}>
                                        {ikonForBrukersMeldekortDagStatus[status]}
                                        {`${brukersMeldekortDagStatusTekst[status]}`}
                                    </HStack>
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </Box>
    );
};
