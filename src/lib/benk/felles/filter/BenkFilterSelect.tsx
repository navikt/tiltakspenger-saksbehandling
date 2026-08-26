import { Select } from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';

type Props<T extends string> = {
    label: string;
    value: Nullable<T>;
    onChange: (value: Nullable<T>) => void;
    /** Verdi -> visningstekst for alle alternativer */
    alternativer: Record<T, string>;
};

/** Selecten alle enum-filtrene i benken deler - tom verdi betyr «Alle» (ikke filtrert) */
export const BenkFilterSelect = <T extends string>({
    label,
    value,
    onChange,
    alternativer,
}: Props<T>) => (
    <Select
        label={label}
        size={'small'}
        value={value ?? ''}
        onChange={(e) => onChange((e.target.value as T) || null)}
    >
        <option value={''}>{'Alle'}</option>
        {Object.entries(alternativer).map(([verdi, tekst]) => (
            <option key={verdi} value={verdi}>
                {tekst as string}
            </option>
        ))}
    </Select>
);
