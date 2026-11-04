import { Checkbox, CheckboxProps } from '@navikt/ds-react';
import { classNames } from '~/utils/classNames';

import style from './CheckboxMedLabelTilVenstre.module.css';

export const CheckboxMedLabelTilVenstre = ({ className, ...props }: CheckboxProps) => (
    <Checkbox {...props} className={classNames(style.checkbox, className)} />
);
