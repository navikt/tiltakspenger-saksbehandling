import { useState } from 'react';
import { Button, Heading, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useBehandlingInnvilgelseSkjemaDispatch } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { BarnetilleggBarnSkjema } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { LeggTilBarnFraFolkeregister } from '~/lib/rammebehandling/felles/barnetillegg/barn/LeggTilBarnFraFolkeregister';
import { LeggTilBarnManuelt } from '~/lib/rammebehandling/felles/barnetillegg/barn/LeggTilBarnManuelt';

import style from './BarnetilleggBarn.module.css';

type Kilde = 'folkeregister' | 'manuelt';

type Props = {
    // Barn som allerede finnes i listen, og ikke kan legges til på nytt
    eksisterendeBarn: BarnetilleggBarnSkjema[];
};

export const LeggTilBarnetilleggBarn = ({ eksisterendeBarn }: Props) => {
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();
    const { behandling } = useBehandling();

    const [visSkjema, setVisSkjema] = useState(false);
    const [kilde, setKilde] = useState<Kilde>('folkeregister');

    const lukk = () => {
        setVisSkjema(false);
        setKilde('folkeregister');
    };

    const leggTil = (barn: BarnetilleggBarnSkjema) => {
        dispatch({ type: 'leggTilManueltBarnetilleggBarn', payload: { barn } });
        lukk();
    };

    if (!visSkjema) {
        return (
            <Button
                type={'button'}
                variant={'secondary'}
                size={'small'}
                icon={<PlusIcon aria-hidden />}
                className={style.leggTilKnapp}
                onClick={() => setVisSkjema(true)}
            >
                {'Legg til barn'}
            </Button>
        );
    }

    return (
        <VStack gap={'space-16'} className={style.leggTilSkjema}>
            <Heading level={'4'} size={'xsmall'}>
                {'Legg til barn'}
            </Heading>
            <RadioGroup
                legend={'Hvordan vil du legge til barnet?'}
                hideLegend={true}
                size={'small'}
                value={kilde}
                onChange={(verdi: Kilde) => setKilde(verdi)}
                className={style.radioGroup}
            >
                <Radio value={'folkeregister'}>{'Hent fra folkeregisteret'}</Radio>
                <Radio value={'manuelt'}>{'Skriv inn manuelt'}</Radio>
            </RadioGroup>
            {kilde === 'folkeregister' ? (
                <LeggTilBarnFraFolkeregister
                    sakId={behandling.sakId}
                    behandlingId={behandling.id}
                    eksisterendeBarn={eksisterendeBarn}
                    onLeggTil={leggTil}
                    onAvbryt={lukk}
                />
            ) : (
                <LeggTilBarnManuelt
                    eksisterendeBarn={eksisterendeBarn}
                    onLeggTil={leggTil}
                    onAvbryt={lukk}
                />
            )}
        </VStack>
    );
};
