import { Alert, Textarea } from '@navikt/ds-react';
import { ComponentProps, forwardRef, useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { classNames } from '../../utils/classNames';
import { fetchJsonFraApiClientSide } from '../../utils/fetch/fetch';

import style from './TekstfeltMedMellomlagring.module.css';

const LAGRE_TIMER_MS = 3000;
const LAGRE_MAX_WAIT_MS = 10000;

type Props = {
    lagringUrl: string;
    lagringBody: (tekst: string) => unknown;
    minRows?: number;
} & ComponentProps<typeof Textarea>;

export const TekstfeltMedMellomlagring = forwardRef<HTMLTextAreaElement, Props>(
    (
        {
            label,
            hideLabel = true,
            lagringUrl,
            lagringBody,
            onChange,
            minRows,
            readOnly,
            ...textareaProps
        },
        ref,
    ) => {
        const [venterPåLagring, setVenterPåLagring] = useState(false);
        const [lagringFeil, setLagringFeil] = useState<string | null>(null);

        // TODO: legg på timestamp el for å hindre out of order lagring?
        // Denne må wrappes i useCallback for ikke å kalles flere ganger for hver lagring
        // eslint skjønner ikke higher order functions, men den er ok!
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const lagre = useCallback(
            debounce(
                async (body: unknown) => {
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

        useEffect(() => {
            // Ikke lagre mer hvis komponenten slutter å akseptere input (antagelig fordi behandlingen er sendt inn)
            if (readOnly) {
                lagre.cancel();
                setVenterPåLagring(false);
                setLagringFeil(null);
            }
        }, [readOnly]);

        return (
            <div>
                <Textarea
                    label={label}
                    hideLabel={hideLabel}
                    minRows={minRows ?? 5}
                    resize={'vertical'}
                    onChange={(event) => {
                        setVenterPåLagring(true);
                        setLagringFeil(null);
                        lagre(lagringBody(event.target.value));
                        onChange?.(event);
                    }}
                    ref={ref}
                    readOnly={readOnly}
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
                    <span
                        className={classNames(style.lagringVarsel, venterPåLagring && style.venter)}
                    >
                        {venterPåLagring ? '' : 'Teksten er lagret'}
                    </span>
                )}
            </div>
        );
    },
);

TekstfeltMedMellomlagring.displayName = 'TekstfeltMedMellomlagring';
