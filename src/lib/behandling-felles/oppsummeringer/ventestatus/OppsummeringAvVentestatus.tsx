import styles from './OppsummeringAvVentestatus.module.css';
import { Box, Heading, HStack, VStack } from '@navikt/ds-react';
import { formaterDatotekst, formaterTidspunkt } from '~/utils/date';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';
import { classNames } from '~/utils/classNames';
import { VentestatusHendelse } from '~/types/Ventestatus';

const OppsummeringAvVentestatus = (props: {
    ventestatus: VentestatusHendelse;
    wrapperClassName?: string;
    size?: 'medium' | 'small';
    medHistorikkVisning?: () => React.ReactNode;
}) => {
    return (
        <Box
            className={classNames(
                styles.box,
                props.size === 'small' ? styles['box-small'] : styles['box-medium'],
                props.wrapperClassName,
            )}
        >
            <VStack gap="space-24">
                <VStack gap={'space-24'}>
                    <Heading size={props.size ?? 'medium'} level="3">
                        {props.ventestatus.erSattPåVent
                            ? 'Behandlingen er satt på vent'
                            : 'Behandlingen er gjenopptatt'}
                    </Heading>
                    <HStack gap={'space-24'}>
                        <OppsummeringsPar
                            label={
                                props.ventestatus.erSattPåVent
                                    ? 'Satt på vent av'
                                    : 'Gjenopptatt av'
                            }
                            verdi={props.ventestatus.sattPåVentAv}
                            retning="vertikal"
                        />
                        <OppsummeringsPar
                            label={'Tidspunkt'}
                            verdi={formaterTidspunkt(props.ventestatus.tidspunkt)}
                            retning="vertikal"
                        />
                        {props.ventestatus.frist && (
                            <OppsummeringsPar
                                label={'Frist'}
                                verdi={formaterDatotekst(props.ventestatus.frist)}
                                retning="vertikal"
                            />
                        )}
                    </HStack>
                    {props.ventestatus.begrunnelse && (
                        <OppsummeringsPar
                            label={'Begrunnelse'}
                            verdi={props.ventestatus.begrunnelse}
                            retning="vertikal"
                        />
                    )}
                </VStack>
                {props.medHistorikkVisning && props.medHistorikkVisning()}
            </VStack>
        </Box>
    );
};

export default OppsummeringAvVentestatus;
