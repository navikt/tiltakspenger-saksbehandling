import { BodyLong, BodyShort, Button, Heading } from '@navikt/ds-react';
import { ParagraphIcon, TasklistIcon } from '@navikt/aksel-icons';
import { FunctionComponent, ReactNode } from 'react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { FritekstInput } from '~/components/fritekst/FritekstInput';
import { TekstListe } from '../../../liste/TekstListe';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './BegrunnelseVilkårsvurdering.module.css';

export const BegrunnelseVilkårsvurdering = () => {
    const { begrunnelseVilkårsvurdering } = useBehandling().behandling;

    const { textAreas, erReadonly } = useBehandlingSkjema();
    const { begrunnelse } = textAreas;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Heading size={'xsmall'} level={'2'}>
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
                <FritekstInput
                    label={'Begrunnelse vilkårsvurdering'}
                    // TODO Gjorde lintingen strengere ved oppgradering til Next 16. Fikset bare åpenbare feil, denne burde undersøkes.
                    /* eslint-disable-next-line react-hooks/refs */
                    defaultValue={begrunnelse.getValue() ?? begrunnelseVilkårsvurdering ?? ''}
                    readOnly={erReadonly}
                    // TODO Gjorde lintingen strengere ved oppgradering til Next 16. Fikset bare åpenbare feil, denne burde undersøkes.
                    /* eslint-disable-next-line react-hooks/refs */
                    ref={begrunnelse.ref}
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
