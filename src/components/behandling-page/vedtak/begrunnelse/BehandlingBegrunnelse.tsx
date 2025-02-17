import { BodyLong, Button, Heading, Textarea } from '@navikt/ds-react';

import style from './BehandlingBegrunnelse.module.css';
import { ParagraphIcon, TasklistIcon } from '@navikt/aksel-icons';

type Props = {};

export const BehandlingBegrunnelse = ({}: Props) => {
    return (
        <div>
            <div className={style.toppRad}>
                <Heading size={'xsmall'} level={'2'} className={style.header}>
                    {'Begrunnelse vilkårsvurdering'}
                </Heading>
                <div className={style.lovKnapper}>
                    <Button variant={'secondary'} size={'small'}>
                        <TasklistIcon className={style.ikon} />
                    </Button>
                    <Button variant={'secondary'} size={'small'}>
                        <ParagraphIcon className={style.ikon} />
                    </Button>
                </div>
            </div>
            <BodyLong size={'small'}>{'Vurder vilkårene for tiltakspenger og noter ned:'}</BodyLong>
            <BodyLong as={'ul'} size={'small'}>
                <li>{'Hvordan du fant informasjonen'}</li>
                <li>{'Hvordan du vurderte informasjonen opp mot vilkårene'}</li>
            </BodyLong>
            <BodyLong size={'small'} className={style.personinfoVarsel}>
                {'Ikke skriv personsensitiv informasjon'}
            </BodyLong>
            <Textarea label={'Begrunnelse vilkårsvurdering'} hideLabel={true} minRows={10} />
        </div>
    );
};
