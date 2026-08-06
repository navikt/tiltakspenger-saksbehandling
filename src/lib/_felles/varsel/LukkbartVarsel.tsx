import { Button, HStack } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { Infokort, InfokortVariant } from '~/lib/_felles/infokort/Infokort';
import { classNames } from '~/utils/classNames';

import styles from './Varsel.module.css';

type Props = {
    melding: string;
    variant?: InfokortVariant;
    size?: 'medium' | 'small';
    marginX?: boolean;
    className?: string;
};

const LukkbartVarsel = ({ melding, variant, size, marginX = false, className }: Props) => {
    const [vis, settVis] = useState<boolean>(true);

    return vis ? (
        <div className={classNames(styles.varsel, marginX && styles.marginX, className)}>
            <Infokort variant={variant} size={size} role={'status'}>
                <HStack align={'center'} justify={'space-between'} gap={'space-8'} wrap={false}>
                    {melding}
                    <Button
                        type={'button'}
                        variant={'tertiary-neutral'}
                        size={'small'}
                        icon={<XMarkIcon title={'Lukk varselet'} />}
                        onClick={() => settVis(false)}
                    />
                </HStack>
            </Infokort>
        </div>
    ) : null;
};

export default LukkbartVarsel;
