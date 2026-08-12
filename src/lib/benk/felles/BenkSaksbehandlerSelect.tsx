import { useMemo } from 'react';
import { Select } from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { isNonNullish, removeDuplicatesFilter } from '~/utils/array';

type Props = {
    behandlinger: { saksbehandler: Nullable<string>; beslutter: Nullable<string> }[];
    value: Nullable<string | 'IKKE_TILDELT'>;
    onChange: (saksbehandler: Nullable<string | 'IKKE_TILDELT'>) => void;
};

export const BenkSaksbehandlerSelect = ({ behandlinger, value, onChange }: Props) => {
    const innloggetIdent = useSaksbehandler().innloggetSaksbehandler.navIdent;

    // Ekskluderer innlogget saksbehandler, ettersom vi alltid ønsker å vise denne som "Meg"
    const identer = useMemo(() => {
        return behandlinger
            .flatMap((b) => [b.saksbehandler, b.beslutter])
            .filter(
                (ident, index, array): ident is string =>
                    isNonNullish(ident) &&
                    ident !== innloggetIdent &&
                    removeDuplicatesFilter()(ident, index, array),
            )
            .toSorted();
    }, [behandlinger, innloggetIdent]);

    return (
        <Select
            label={'Saksbehandler/Beslutter'}
            size={'small'}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value || null)}
        >
            <option value={''}>{'Alle'}</option>
            <option value={innloggetIdent}>{'Meg'}</option>
            <option value={'IKKE_TILDELT'}>{'Ikke tildelt'}</option>
            {identer.map((ident) => (
                <option key={ident} value={ident}>
                    {ident}
                </option>
            ))}
        </Select>
    );
};
