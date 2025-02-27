import { Alert, Textarea } from '@navikt/ds-react';
import { ComponentProps, useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { classNames } from '../../utils/classNames';
import { fetchJsonFraApiClientSide } from '../../utils/fetch/fetch';

import style from './TekstfeltMedMellomlagring.module.css';

const LAGRE_TIMER_MS = 3000;
const LAGRE_MAX_WAIT_MS = 10000;

type Props<BodyType> = {
    label?: string;
    lagringUrl: string;
    lagringBody: (tekst: string) => BodyType;
} & ComponentProps<typeof Textarea>;

export const TekstfeltMedMellomlagring = <BodyType,>({
    label,
    lagringUrl,
    lagringBody,
    onChange,
    defaultValue,
    ...textareaProps
}: Props<BodyType>) => {
    const [venterPåLagring, setVenterPåLagring] = useState(false);
    const [lagringFeil, setLagringFeil] = useState<string | null>(null);

    // TODO: legg på timestamp el for å hindre out of order lagring?
    const lagre = useCallback(
        debounce(
            async (body: BodyType) => {
                console.log(`Sender til mellomlagring: ${JSON.stringify(body)}`);
                return fetchJsonFraApiClientSide(lagringUrl, {
                    method: 'PATCH',
                    body: JSON.stringify(body),
                })
                    .then(() => {
                        setVenterPåLagring(false);
                        setLagringFeil(null);
                    })
                    .catch((e) => {
                        setLagringFeil(`${e.status} ${e.message}`);
                    });
            },
            LAGRE_TIMER_MS,
            { maxWait: LAGRE_MAX_WAIT_MS },
        ),
        [lagringUrl],
    );

    console.log(`Render tekstfelt "${label}"`);

    return (
        <div>
            <Textarea
                label={label}
                hideLabel={true}
                minRows={10}
                resize={'vertical'}
                defaultValue={defaultValue}
                onChange={(event) => {
                    setVenterPåLagring(true);
                    setLagringFeil(null);
                    lagre(lagringBody(event.target.value));
                    onChange?.(event);
                }}
                {...textareaProps}
            />
            {lagringFeil ? (
                <Alert
                    variant={'error'}
                    size={'small'}
                    inline={true}
                    className={style.lagringFeil}
                >{`Mellomlagring feilet - ${lagringFeil}`}</Alert>
            ) : (
                <span className={classNames(style.lagringVarsel, venterPåLagring && style.venter)}>
                    {venterPåLagring ? '' : 'Teksten er lagret'}
                </span>
            )}
        </div>
    );
};
