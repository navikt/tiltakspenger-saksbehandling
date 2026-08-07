import { useMemo } from 'react';
import { Select } from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';

type Props = {
    behandlinger: { saksbehandler: Nullable<string>; beslutter: Nullable<string> }[];
    value: Nullable<string | 'IKKE_TILDELT'>;
    onChange: (saksbehandler: Nullable<string | 'IKKE_TILDELT'>) => void;
};

export const SaksbehandlerSelect = ({ behandlinger, value, onChange }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    const identer = useMemo(() => {
        const alleIdenter = behandlinger.flatMap((b) => [b.saksbehandler, b.beslutter]);
        return [...new Set(alleIdenter.filter((ident) => ident !== null))].toSorted();
    }, [behandlinger]);

    return (
        <Select
            label={'Saksbehandler/Beslutter'}
            size={'small'}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value || null)}
        >
            <option value={''}>{'Alle'}</option>
            <option value={'IKKE_TILDELT'}>{'Ikke tildelt'}</option>
            {identer.map((ident) => (
                <option key={ident} value={ident}>
                    {innloggetSaksbehandler?.navIdent === ident ? 'Meg' : ident}
                </option>
            ))}
        </Select>
    );
};
