import { BodyShort, HelpText, HStack, VStack } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { formaterMeldeperiodeKort, formaterPeriodeKort } from '~/utils/date';
import { totalPeriode } from '~/utils/periode';

import style from './MeldeperioderTabellVisning.module.css';

type Props = {
    meldeperioder: Periode[];
    align: 'start' | 'end';
};

/**
 * Én meldeperiode vises direkte. Flere vises som totalperioden med antall,
 * og en hjelpetekst lister alle.
 */
export const MeldeperioderTabellVisning = ({ meldeperioder, align }: Props) => {
    if (meldeperioder.length === 0) {
        return <>{'-'}</>;
    }

    if (meldeperioder.length === 1) {
        return <>{formaterMeldeperiodeKort(meldeperioder[0])}</>;
    }

    const periode = totalPeriode(meldeperioder);

    return (
        <HStack gap={'space-4'} justify={align}>
            <span>{formaterPeriodeKort(periode)}</span>
            <span className={style.nobreak}>
                {`(${meldeperioder.length} meldeperioder`}
                <HelpText className={style.meldeperioderHelp}>
                    <VStack gap={'space-4'} align={'start'}>
                        <BodyShort weight={'semibold'}>{'Meldeperioder:'}</BodyShort>
                        {meldeperioder.map((periode) => (
                            <span key={periode.fraOgMed}>{formaterMeldeperiodeKort(periode)}</span>
                        ))}
                    </VStack>
                </HelpText>
                {')'}
            </span>
        </HStack>
    );
};
