import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { Omgjøringsgrad } from '~/lib/rammebehandling/typer/Rammevedtak';
import {
    RammevedtakEllerKlageMedBehandling,
    VedtakType,
} from '~/lib/behandling-felles/typer/BehandlingFelles';
import { classNames } from '~/utils/classNames';

import omgjortGradStyle from '../OmgjortGradBakgrunn.module.css';
import style from './OmgjortGradVisningVelger.module.css';

type Props = {
    vedtakMedBehandling: RammevedtakEllerKlageMedBehandling[];
    visOmgjorte: Omgjøringsgrad[];
    setVisOmgjorte: (omgjøringsgrader: Omgjøringsgrad[]) => void;
};

export const OmgjortGradVisningVelger = ({
    vedtakMedBehandling,
    visOmgjorte,
    setVisOmgjorte,
}: Props) => {
    const antallHeltOmgjort = antallMedOmgjøringsgrad(vedtakMedBehandling, Omgjøringsgrad.HELT);
    const antallDelvisOmgjort = antallMedOmgjøringsgrad(vedtakMedBehandling, Omgjøringsgrad.DELVIS);

    if (antallHeltOmgjort === 0 && antallDelvisOmgjort === 0) {
        return null;
    }

    return (
        <CheckboxGroup
            legend={'Vis omgjorte vedtak'}
            hideLegend={true}
            size={'small'}
            value={visOmgjorte}
            onChange={setVisOmgjorte}
            className={style.omgjortGroup}
        >
            {antallHeltOmgjort > 0 && (
                <Checkbox
                    value={Omgjøringsgrad.HELT}
                    className={classNames(style.omgjortCheckbox, omgjortGradStyle.heltOmgjortBg)}
                >
                    {`Vis helt omgjort (${antallHeltOmgjort})`}
                </Checkbox>
            )}
            {antallDelvisOmgjort > 0 && (
                <Checkbox
                    value={Omgjøringsgrad.DELVIS}
                    className={classNames(style.omgjortCheckbox, omgjortGradStyle.delvisOmgjortBg)}
                >
                    {`Vis delvis omgjort (${antallDelvisOmgjort})`}
                </Checkbox>
            )}
        </CheckboxGroup>
    );
};

const antallMedOmgjøringsgrad = (
    vedtak: RammevedtakEllerKlageMedBehandling[],
    omgjøringsgrad: Omgjøringsgrad,
) =>
    vedtak.filter(
        (it) => it.vedtakType === VedtakType.Rammebehandling && it.omgjortGrad === omgjøringsgrad,
    ).length;
