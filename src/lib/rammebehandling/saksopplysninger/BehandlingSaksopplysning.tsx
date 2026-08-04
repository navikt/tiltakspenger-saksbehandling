import { BodyShort, HStack } from '@navikt/ds-react';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { classNames } from '~/utils/classNames';
import { formaterSøknadsspørsmålSvar } from '~/utils/tekstformateringUtils';

import style from './BehandlingSaksopplysning.module.css';

type Props = {
    navn: string;
    verdi?: string;
    spacing?: boolean;
    visVarsel?: boolean;
};

export const BehandlingSaksopplysning = ({ navn, verdi, spacing, visVarsel = false }: Props) => {
    return (
        <HStack
            gap={'space-8'}
            justify={'space-between'}
            align={'center'}
            className={classNames(visVarsel && style.varsel)}
        >
            <BodyShort
                size={'small'}
                className={classNames(style.opplysning, spacing && style.spacing)}
            >
                {verdi ? (
                    <>
                        {`${navn}: `}
                        <strong>{formaterSøknadsspørsmålSvar(verdi)}</strong>
                    </>
                ) : (
                    <>{`${navn}`}</>
                )}
            </BodyShort>
            {visVarsel && <ExclamationmarkTriangleFillIcon />}
        </HStack>
    );
};
