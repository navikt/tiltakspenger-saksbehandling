import { useMemo } from 'react';
import { Select } from '@navikt/ds-react';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { removeDuplicatesFilter } from '~/utils/array';
import { isValueInRecord } from '~/utils/object';
import { BenkGlobaltFilter, BenkIkkeTildelt, BenkSaksbehandlerFilter } from '../../typer/felles';
import { BenkFilterSkjemaTilstand } from './useBenkFilterSkjema';

type Props = {
    skjema: BenkFilterSkjemaTilstand<
        BenkGlobaltFilter & { saksbehandler: BenkSaksbehandlerFilter }
    >;
    saksbehandlere: string[];
    besluttere: string[];
};

export const BenkSaksbehandlerSelect = ({ skjema, saksbehandlere, besluttere }: Props) => {
    const innloggetIdent = useSaksbehandler().innloggetSaksbehandler.navIdent;
    const valgtSaksbehandler = skjema.valgtFilter.saksbehandler;
    const disabled = skjema.aktivtFilter.kunTildeltMeg;

    // Ekskluderer innlogget saksbehandler, ettersom vi alltid ønsker å vise denne som "Meg"
    const identer = useMemo(() => {
        return [
            ...saksbehandlere,
            ...besluttere,
            ...(erIdent(valgtSaksbehandler) ? [valgtSaksbehandler] : []),
        ]
            .filter(
                (ident, index, array) =>
                    ident !== innloggetIdent && removeDuplicatesFilter()(ident, index, array),
            )
            .toSorted();
    }, [saksbehandlere, besluttere, innloggetIdent, valgtSaksbehandler]);

    return (
        <Select
            label={'Saksbehandler/Beslutter'}
            size={'small'}
            value={disabled ? innloggetIdent : (valgtSaksbehandler ?? '')}
            onChange={(e) => skjema.endreFilter({ saksbehandler: e.target.value || null })}
            disabled={disabled}
        >
            <option value={''}>{'Alle'}</option>
            <option value={BenkIkkeTildelt.IKKE_TILDELT}>{'Ikke tildelt'}</option>
            <option value={BenkIkkeTildelt.IKKE_TILDELT_SAKSBEHANDLER}>
                {'Ikke tildelt saksbehandler'}
            </option>
            <option value={BenkIkkeTildelt.IKKE_TILDELT_BESLUTTER}>
                {'Ikke tildelt beslutter'}
            </option>
            <option value={innloggetIdent}>{`Meg (${innloggetIdent})`}</option>
            <option disabled={true}>{'──────────'}</option>
            {identer.map((ident) => (
                <option key={ident} value={ident}>
                    {ident}
                </option>
            ))}
        </Select>
    );
};

const erIdent = (ident: string | null): ident is string =>
    !!ident && !isValueInRecord(ident, BenkIkkeTildelt);
