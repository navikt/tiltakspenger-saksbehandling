import { BodyLong, Button, Heading, Textarea, Tooltip } from '@navikt/ds-react';
import { ParagraphIcon, TasklistIcon } from '@navikt/aksel-icons';
import { useBehandling } from '../../BehandlingContext';

import style from './BehandlingBegrunnelse.module.css';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';

const HEADING_ID = 'begrunnelse-heading';

export const BehandlingBegrunnelse = () => {
    const { behandling, setBegrunnelse, rolleForBehandling } = useBehandling();

    const { begrunnelseVilkårsvurdering } = behandling;

    return (
        <>
            <div className={style.toppRad}>
                <Heading size={'xsmall'} level={'2'} className={style.header} id={HEADING_ID}>
                    {'Begrunnelse vilkårsvurdering'}
                </Heading>

                <div className={style.lovKnapper}>
                    <Tooltip content={'Rundskriv om tiltakspenger'}>
                        <Button
                            variant={'secondary'}
                            size={'small'}
                            as={'a'}
                            href={
                                'https://lovdata.no/nav/rundskriv/r76-13-02?q=rundskriv%20om%20tiltakspenger'
                            }
                            target={'_blank'}
                        >
                            <TasklistIcon className={style.ikon} />
                        </Button>
                    </Tooltip>
                    <Tooltip content={'Forskrift om tiltakspenger'}>
                        <Button
                            variant={'secondary'}
                            size={'small'}
                            as={'a'}
                            href={'https://lovdata.no/nav/forskrift/2013-11-04-1286'}
                            target={'_blank'}
                        >
                            <ParagraphIcon className={style.ikon} />
                        </Button>
                    </Tooltip>
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

            <Textarea
                label={''}
                aria-describedby={HEADING_ID}
                hideLabel={true}
                minRows={10}
                resize={'vertical'}
                defaultValue={begrunnelseVilkårsvurdering ?? ''}
                readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                onChange={(event) => {
                    setBegrunnelse(event.target.value);
                }}
            />
        </>
    );
};
