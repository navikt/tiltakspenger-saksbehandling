import React from 'react';
import { HelpText, HStack, Tag } from '@navikt/ds-react';
import { BenkBehandling } from '~/lib/benk/typer/Benk';
import { antallKalenderDagerUnnaDagensDato, formaterDatotekst } from '~/utils/date';
import { AkselColor } from '@navikt/ds-react/types/theme';
import { Nullable } from '~/types/UtilTypes';

type Props = {
    behandling: BenkBehandling;
};

export const BenkVentestatus = ({ behandling }: Props) => {
    const { erSattPåVent, sattPåVentFrist, sattPåVentBegrunnelse } = behandling;

    if (!erSattPåVent) {
        return null;
    }

    return (
        <HStack gap={'space-4'} align={'center'}>
            <Tag data-color={finnTagColor(sattPåVentFrist)} variant={'moderate'}>
                {sattPåVentFrist ? `Venter til ${formaterDatotekst(sattPåVentFrist)}` : 'Venter'}
            </Tag>
            {sattPåVentBegrunnelse && <HelpText>{sattPåVentBegrunnelse}</HelpText>}
        </HStack>
    );
};

const finnTagColor = (fristDato: Nullable<string>): AkselColor => {
    if (!fristDato) {
        return 'danger';
    }

    const antallDager = antallKalenderDagerUnnaDagensDato(fristDato);

    if (antallDager <= 0) {
        return 'danger';
    } else if (antallDager <= 3) {
        return 'warning';
    } else {
        return 'info';
    }
};
