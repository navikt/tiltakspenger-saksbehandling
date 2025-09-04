import { Button } from '@navikt/ds-react';
import { Simulering } from '~/types/Simulering';
import OppsummeringAvSimulering from '../../../oppsummeringer/simulering/OppsummeringAvSimulering';
import { useState } from 'react';
import { erSimuleringEndring } from '~/utils/simuleringUtils';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

import style from './Simulering.module.css';

type Props = {
    simulering?: Simulering;
};

export const Simuleringsknapp = ({ simulering }: Props) => {
    const [vilSeSimulering, setVilSeSimulering] = useState(false);

    const erFeilutbetalingStørreEnn0 =
        simulering && erSimuleringEndring(simulering) && simulering.totalFeilutbetaling > 0;

    return (
        <>
            {simulering && (
                <>
                    <Button
                        onClick={() => setVilSeSimulering(!vilSeSimulering)}
                        variant={'secondary'}
                        size={'small'}
                        type={'button'}
                        icon={
                            erFeilutbetalingStørreEnn0 && (
                                <ExclamationmarkTriangleFillIcon
                                    className={style.advarselIkon}
                                    title="Advarsel ikon"
                                    fontSize="1rem"
                                />
                            )
                        }
                        className={style.seSimuleringKnapp}
                    >
                        {`${vilSeSimulering ? 'Skjul' : 'Vis'} simulering`}
                    </Button>
                    {vilSeSimulering && <OppsummeringAvSimulering simulering={simulering!} />}
                </>
            )}
        </>
    );
};
