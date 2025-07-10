import React from 'react';
import styles from './OppsummeringBehandlingSattPåVent.module.css';
import { Box, Heading, HStack, VStack } from '@navikt/ds-react';
import { formaterTidspunkt } from '~/utils/date';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';
import { classNames } from '~/utils/classNames';
import { SattPåVentBegrunnelse } from '~/types/SattPåVentBegrunnelse';

const BehandlingSattPåVentOppsummering = (props: {
    begrunnelse: SattPåVentBegrunnelse;
    wrapperClassName?: string;
}) => {
    return (
        <Box className={classNames(styles.box, props.wrapperClassName)}>
            <VStack gap="6">
                <Heading size="medium" level="3">
                    Behandlingen er satt på vent
                </Heading>
                <HStack gap="6">
                    <OppsummeringsPar
                        label={'Satt på vent av'}
                        verdi={props.begrunnelse.sattPåVentAv}
                        retning="vertikal"
                    />
                    <OppsummeringsPar
                        label={'Tidspunkt'}
                        verdi={formaterTidspunkt(props.begrunnelse.tidspunkt)}
                        retning="vertikal"
                    />
                </HStack>
                <OppsummeringsPar
                    label={'Begrunnelse'}
                    verdi={props.begrunnelse.begrunnelse}
                    retning="vertikal"
                />
            </VStack>
        </Box>
    );
};

export default BehandlingSattPåVentOppsummering;
