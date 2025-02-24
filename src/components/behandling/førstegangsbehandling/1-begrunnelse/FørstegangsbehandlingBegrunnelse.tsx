import { BodyLong, BodyShort, Button, Heading, Textarea } from '@navikt/ds-react';
import { ParagraphIcon, TasklistIcon } from '@navikt/aksel-icons';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useFørstegangsbehandling } from '../FørstegangsbehandlingContext';
import { FunctionComponent, ReactNode } from 'react';
import { VedtakSeksjon } from '../../vedtak/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '../../vedtak/hjelpetekst/VedtakHjelpetekst';

import style from './FørstegangsbehandlingBegrunnelse.module.css';

export const FørstegangsbehandlingBegrunnelse = () => {
    const { behandling, setBegrunnelse, rolleForBehandling } = useFørstegangsbehandling();
    const { begrunnelseVilkårsvurdering } = behandling;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Heading size={'xsmall'} level={'2'} className={style.header}>
                    {'Begrunnelse vilkårsvurdering'}
                </Heading>
                <BodyLong size={'small'}>{'Noter ned vurderingen.'}</BodyLong>
                <BodyLong size={'small'} className={style.personinfoVarsel}>
                    {'Ikke skriv personsensitiv informasjon som ikke er relevant for saken.'}
                </BodyLong>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
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
            </VedtakSeksjon.Høyre>
            <VedtakSeksjon.Venstre>
                <Textarea
                    label={''}
                    hideLabel={true}
                    minRows={10}
                    resize={'vertical'}
                    defaultValue={begrunnelseVilkårsvurdering ?? ''}
                    readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                    onChange={(event) => {
                        setBegrunnelse(event.target.value);
                    }}
                />
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
                <VedtakHjelpetekst header={'Vilkårsvurdering'}>
                    <BodyLong size={'small'}>
                        {'Vurder vilkårene for tiltakspenger og noter ned:'}
                    </BodyLong>
                    <ul>
                        <li>
                            {
                                'Er det noe som begrenser retten? Vis til informasjonen du har funnet, hvordan det endrer retten og paragrafen det gjelder'
                            }
                        </li>
                        <li>{'Eventuelle kommentarer til beslutter'}</li>
                    </ul>
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
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
