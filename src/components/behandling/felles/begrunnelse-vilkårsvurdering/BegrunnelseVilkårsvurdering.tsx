import { BodyLong, BodyShort, Button, Heading } from '@navikt/ds-react';
import { ParagraphIcon, TasklistIcon } from '@navikt/aksel-icons';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { FunctionComponent, ReactNode, RefObject } from 'react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { TekstfeltMedMellomlagring } from '../../../tekstfelt/TekstfeltMedMellomlagring';
import { VedtakBegrunnelseLagringDTO } from '~/types/VedtakTyper';
import { TekstListe } from '../../../liste/TekstListe';
import { BehandlingData } from '~/types/BehandlingTypes';
import { Nullable } from '~/types/UtilTypes';

import style from './BegrunnelseVilkårsvurdering.module.css';

type Props = {
    behandling: BehandlingData;
    rolle: Nullable<SaksbehandlerRolle>;
    tekstRef: RefObject<HTMLTextAreaElement>;
    className?: string;
};

export const BegrunnelseVilkårsvurdering = ({ behandling, rolle, tekstRef, className }: Props) => {
    const { begrunnelseVilkårsvurdering, sakId, id } = behandling;

    return (
        <VedtakSeksjon className={className}>
            <VedtakSeksjon.Venstre>
                <Heading size={'xsmall'} level={'2'} className={style.header}>
                    {'Begrunnelse vilkårsvurdering'}
                </Heading>
                <BodyLong size={'small'}>{'Noter ned vurderingen.'}</BodyLong>
                <BodyLong size={'small'} className={style.personinfoVarsel}>
                    {
                        'Ikke skriv personsensitiv informasjon som ikke er relevant for saken. Husk at bruker har rett til innsyn.'
                    }
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
                <TekstfeltMedMellomlagring
                    label={'Begrunnelse vilkårsvurdering'}
                    defaultValue={begrunnelseVilkårsvurdering ?? ''}
                    readOnly={rolle !== SaksbehandlerRolle.SAKSBEHANDLER}
                    lagringUrl={`/sak/${sakId}/behandling/${id}/begrunnelse`}
                    lagringBody={(tekst) =>
                        ({ begrunnelse: tekst }) satisfies VedtakBegrunnelseLagringDTO
                    }
                    ref={tekstRef}
                />
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
                <VedtakHjelpetekst header={'Vilkårsvurdering'}>
                    <BodyLong size={'small'}>
                        {'Vurder vilkårene for tiltakspenger og noter ned:'}
                    </BodyLong>
                    <TekstListe
                        tekster={[
                            'Er det noe som begrenser retten? Vis til informasjonen du har funnet, hvordan det endrer retten og paragrafen det gjelder',
                            'Eventuelle kommentarer til beslutter',
                        ]}
                    />
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
