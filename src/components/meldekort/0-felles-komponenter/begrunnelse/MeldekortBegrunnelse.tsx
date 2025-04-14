import { BodyLong, Heading, Textarea } from '@navikt/ds-react';
import { ComponentProps } from 'react';
import { classNames } from '../../../../utils/classNames';

import style from './MeldekortBegrunnelse.module.css';

type Props = Partial<ComponentProps<typeof Textarea>>;

export const MeldekortBegrunnelse = ({ readOnly, className, ...rest }: Props) => {
    return (
        <div>
            <Heading size={'xsmall'} level={'2'} className={style.header}>
                {'Begrunnelse (valgfri)'}
            </Heading>
            {!readOnly && (
                <BodyLong size={'small'} className={style.personinfoVarsel}>
                    {'Ikke skriv personsensitiv informasjon som ikke er relevant for saken.'}
                </BodyLong>
            )}
            <Textarea
                {...rest}
                label={'Begrunnelse'}
                hideLabel={true}
                minRows={5}
                resize={'vertical'}
                readOnly={readOnly}
                className={classNames(className, readOnly && style.readonly)}
            />
        </div>
    );
};
