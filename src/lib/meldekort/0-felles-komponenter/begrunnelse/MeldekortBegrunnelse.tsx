import { Textarea } from '@navikt/ds-react';
import { ComponentProps } from 'react';
import { classNames } from '../../../../utils/classNames';

import style from './MeldekortBegrunnelse.module.css';

type Props = Partial<ComponentProps<typeof Textarea>>;

export const MeldekortBegrunnelse = ({ readOnly, className, ...rest }: Props) => {
    return (
        <div>
            <Textarea
                {...rest}
                label="Begrunnelse for meldekortbehandling (valgfri)"
                description="Noter vurderingen. Ikke skriv personsensitive opplysninger som ikke er relevant for saken"
                minRows={5}
                resize={'vertical'}
                readOnly={readOnly}
                className={classNames(className, readOnly && style.readonly)}
            />
        </div>
    );
};
