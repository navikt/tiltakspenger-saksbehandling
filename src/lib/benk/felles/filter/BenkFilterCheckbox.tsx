import { Checkbox } from '@navikt/ds-react';
import { ReactNode } from 'react';

type Props = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    children: ReactNode;
};

export const BenkFilterCheckbox = ({ checked, onChange, children }: Props) => (
    <Checkbox size={'small'} checked={checked} onChange={(e) => onChange(e.target.checked)}>
        {children}
    </Checkbox>
);
