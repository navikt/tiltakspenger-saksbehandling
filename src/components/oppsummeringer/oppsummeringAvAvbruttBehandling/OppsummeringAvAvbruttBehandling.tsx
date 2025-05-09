import React from 'react';
import { Box, Heading, HStack, VStack } from '@navikt/ds-react';

import styles from './OppsummeringAvAvbruttBehandling.module.css';

import { formaterTidspunkt } from '../../../utils/date';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';
import { Avbrutt } from '../../../types/Avbrutt';
import { classNames } from '../../../utils/classNames';

const AvbruttOppsummering = (props: {
    avbrutt: Avbrutt;
    withPanel?: boolean;
    wrapperClassName?: string;
}) => {
    return (
        <Box
            background={props.withPanel ? 'surface-default' : undefined}
            className={classNames(styles.box, props.wrapperClassName)}
        >
            <VStack gap="6">
                <Heading size="medium" level="3">
                    Behandling er avsluttet
                </Heading>
                <HStack gap="6">
                    <OppsummeringsPar
                        label={'Avsluttet av'}
                        verdi={props.avbrutt.avbruttAv}
                        retning="vertikal"
                    />
                    <OppsummeringsPar
                        label={'Tidspunkt avsluttet'}
                        verdi={formaterTidspunkt(props.avbrutt.avbruttTidspunkt)}
                        retning="vertikal"
                    />
                </HStack>
                <OppsummeringsPar
                    label={'Begrunnelse'}
                    verdi={props.avbrutt.begrunnelse}
                    retning="vertikal"
                />
            </VStack>
        </Box>
    );
};

export default AvbruttOppsummering;
