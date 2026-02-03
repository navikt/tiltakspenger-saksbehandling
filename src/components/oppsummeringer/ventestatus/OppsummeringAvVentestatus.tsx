import React from 'react';
import styles from './OppsummeringAvVentestatus.module.css';
import { Box, Heading, HStack, VStack } from '@navikt/ds-react';
import { formaterTidspunkt } from '~/utils/date';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';
import { classNames } from '~/utils/classNames';
import { VentestatusHendelse } from '~/types/Ventestatus';

const OppsummeringAvVentestatus = (props: {
    ventestatus: VentestatusHendelse;
    wrapperClassName?: string;
}) => {
    return (
        <Box className={classNames(styles.box, props.wrapperClassName)}>
            <VStack gap="space-24">
                <Heading size="medium" level="3">
                    Behandlingen er satt på vent
                </Heading>
                <HStack gap="space-24">
                    <OppsummeringsPar
                        label={'Satt på vent av'}
                        verdi={props.ventestatus.sattPåVentAv}
                        retning="vertikal"
                    />
                    <OppsummeringsPar
                        label={'Tidspunkt'}
                        verdi={formaterTidspunkt(props.ventestatus.tidspunkt)}
                        retning="vertikal"
                    />
                </HStack>
                <OppsummeringsPar
                    label={'Begrunnelse'}
                    verdi={props.ventestatus.begrunnelse}
                    retning="vertikal"
                />
            </VStack>
        </Box>
    );
};

export default OppsummeringAvVentestatus;
