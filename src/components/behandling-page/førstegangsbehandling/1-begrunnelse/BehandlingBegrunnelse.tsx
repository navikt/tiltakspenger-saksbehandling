import { BodyLong, BodyShort, Button, Heading, Textarea } from '@navikt/ds-react';
import { ParagraphIcon, TasklistIcon } from '@navikt/aksel-icons';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useFørstegangsbehandling } from '../FørstegangsbehandlingContext';
import { FunctionComponent, ReactNode } from 'react';

import style from './BehandlingBegrunnelse.module.css';

const HEADING_ID = 'begrunnelse-heading';

export const BehandlingBegrunnelse = () => {
    const { behandling, setBegrunnelse, rolleForBehandling } = useFørstegangsbehandling();

    const { begrunnelseVilkårsvurdering } = behandling;

    return (
        <>
            <div className={style.toppRad}>
                <Heading size={'xsmall'} level={'2'} className={style.header} id={HEADING_ID}>
                    {'Begrunnelse vilkårsvurdering'}
                </Heading>

                <div className={style.lovKnapper}>
                    <LovKnapp
                        href={'https://lovdata.no/nav/forskrift/2013-11-04-1286'}
                        ikon={ParagraphIcon}
                    >
                        {'Forskrift'}
                    </LovKnapp>
                    <LovKnapp
                        href={
                            'https://lovdata.no/nav/rundskriv/r76-13-02?q=rundskriv%20om%20tiltakspenger'
                        }
                        ikon={TasklistIcon}
                    >
                        {'Rundskriv'}
                    </LovKnapp>
                </div>
            </div>

            <BodyLong size={'small'}>{'Vurder vilkårene for tiltakspenger og noter ned:'}</BodyLong>
            <BodyLong as={'ul'} size={'small'}>
                <li>{'Hvordan du fant informasjonen'}</li>
                <li>{'Hvordan du vurderte informasjonen opp mot vilkårene'}</li>
            </BodyLong>

            <Textarea
                label={''}
                description={
                    <BodyLong size={'small'} className={style.personinfoVarsel}>
                        {'Ikke skriv personsensitiv informasjon'}
                    </BodyLong>
                }
                aria-describedby={HEADING_ID}
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

type LovKnappProps = {
    href: string;
    ikon: FunctionComponent;
    children: ReactNode;
};

const LovKnapp = ({ href, ikon: IkonComponent, children }: LovKnappProps) => {
    return (
        <Button variant={'secondary'} size={'small'} as={'a'} href={href} target={'_blank'}>
            <IkonComponent />
            <BodyShort size={'small'} weight={'semibold'}>
                {children}
            </BodyShort>
        </Button>
    );
};
