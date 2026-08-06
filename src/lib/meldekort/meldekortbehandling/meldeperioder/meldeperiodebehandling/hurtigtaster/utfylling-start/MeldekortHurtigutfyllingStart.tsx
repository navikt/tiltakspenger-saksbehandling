import { BodyShort, Button, HelpText, HStack, Label, VStack } from '@navikt/ds-react';
import { Fragment } from 'react';
import { meldekortDagStatusHurtigtaster } from '~/lib/meldekort/meldekortbehandling/meldeperioder/meldeperiodebehandling/hurtigtaster/meldekortDagStatusHurtigtaster';
import { PlayIcon } from '@navikt/aksel-icons';
import { MeldekortHurtigutfylling } from '~/lib/meldekort/meldekortbehandling/meldeperioder/meldeperiodebehandling/hurtigtaster/useMeldekortHurtigutfylling';

import style from './MeldekortHurtigutfyllingStart.module.css';
import { meldekortbehandlingDagStatusTekst } from '~/lib/meldekort/utils/meldekortTekster';

type Props = {
    hurtigutfylling: MeldekortHurtigutfylling;
};

export const MeldekortHurtigutfyllingStart = ({ hurtigutfylling }: Props) => {
    const { kanStarte } = hurtigutfylling;

    if (!kanStarte) {
        return null;
    }

    return (
        <HStack gap={'space-8'} align={'center'} className={style.hurtigutfylling}>
            <Button
                type={'button'}
                size={'small'}
                variant={'tertiary'}
                icon={<PlayIcon aria-hidden={true} />}
                disabled={hurtigutfylling.aktivDagIndex !== null}
                onClick={hurtigutfylling.start}
            >
                {'Start hurtigutfylling'}
            </Button>

            <HurtigtasterHelpText />
        </HStack>
    );
};

const HurtigtasterHelpText = () => (
    <HelpText title={'Hurtigutfylling hjelp'}>
        <VStack gap={'space-8'}>
            <Label size={'small'}>{'Hurtigutfylling av meldekortet'}</Label>

            <BodyShort size={'small'}>
                {
                    'Hurtigutfyllingen går fortløpende gjennom dagene og lar deg fylle ut statusene med knapper eller angitte hurtigtaster. '
                }
            </BodyShort>

            <dl className={style.hurtigtaster}>
                {meldekortDagStatusHurtigtaster.map(({ tast, status }) => (
                    <Fragment key={tast}>
                        <BodyShort size={'small'} weight={'semibold'} as={'dt'}>
                            {tast.toUpperCase()}
                        </BodyShort>
                        <BodyShort size={'small'} as={'dd'}>
                            {meldekortbehandlingDagStatusTekst[status]}
                        </BodyShort>
                    </Fragment>
                ))}
            </dl>
        </VStack>
    </HelpText>
);
