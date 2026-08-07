import { Table } from '@navikt/ds-react';
import { ReactNode } from 'react';
import { RammebehandlingResultatTag } from '~/lib/rammebehandling/felles/resultat-tag/RammebehandlingResultatTag';
import { KlagebehandlingResultatTag } from '~/lib/klage/tags/KlagebehandlingResultatTag';
import { BenkV2Behandling, BenkV2Behandlingstype } from '../typer/felles';

type Props = {
    behandling: BenkV2Behandling;
};

/** Resultatet vises som en tag når det er valgt, ellers '-' */
export const ResultatCelle = ({ behandling }: Props) => {
    const tagComponent = resultatTag(behandling);

    return tagComponent ? <Table.DataCell>{tagComponent}</Table.DataCell> : null;
};

const resultatTag = (behandling: BenkV2Behandling): ReactNode => {
    switch (behandling.type) {
        case BenkV2Behandlingstype.SØKNADSBEHANDLING:
        case BenkV2Behandlingstype.REVURDERING:
            return behandling.resultat ? (
                <RammebehandlingResultatTag resultat={behandling.resultat} size={'small'} />
            ) : (
                '-'
            );
        case BenkV2Behandlingstype.KLAGEBEHANDLING:
            return behandling.resultat ? (
                <KlagebehandlingResultatTag resultat={behandling.resultat} size={'small'} />
            ) : (
                '-'
            );
    }

    return null;
};
