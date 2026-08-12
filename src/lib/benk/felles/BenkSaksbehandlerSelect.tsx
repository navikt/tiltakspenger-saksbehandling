import { useMemo } from 'react';
import { Select } from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { removeDuplicatesFilter } from '~/utils/array';

const IKKE_TILDELT = 'IKKE_TILDELT';

type Props = {
    saksbehandlere: string[];
    besluttere: string[];
    valgtSaksbehandler: Nullable<string>;
    onChange: (saksbehandler: Nullable<string>) => void;
};

export const BenkSaksbehandlerSelect = ({
    saksbehandlere,
    besluttere,
    valgtSaksbehandler,
    onChange,
}: Props) => {
    const innloggetIdent = useSaksbehandler().innloggetSaksbehandler.navIdent;

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
            value={valgtSaksbehandler ?? ''}
            onChange={(e) => onChange(e.target.value || null)}
        >
            <option value={''}>{'Alle'}</option>
            <option value={innloggetIdent}>{'Meg'}</option>
            <option value={IKKE_TILDELT}>{'Ikke tildelt'}</option>
            {identer.map((ident) => (
                <option key={ident} value={ident}>
                    {ident}
                </option>
            ))}
        </Select>
    );
};

const erIdent = (ident: string | null): ident is string => !!ident && ident !== IKKE_TILDELT;
