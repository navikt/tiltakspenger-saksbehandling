import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import { ArrowRightIcon, XMarkIcon } from '@navikt/aksel-icons';
import { useEffect, useRef } from 'react';
import { ikonForMeldekortbehandlingDagStatus } from '~/lib/meldekort/utils/meldekortIkoner';
import { meldekortDagStatusHurtigtaster } from '~/lib/meldekort/meldekortbehandling/meldeperioder/meldeperiodebehandling/hurtigtaster/meldekortDagStatusHurtigtaster';
import { formaterDatotekst, ukedagFraDato } from '~/utils/date';
import { MeldekortHurtigutfylling } from '~/lib/meldekort/meldekortbehandling/meldeperioder/meldeperiodebehandling/hurtigtaster/useMeldekortHurtigutfylling';

import style from './MeldekortHurtigutfyllingStatusVelger.module.css';
import { meldekortbehandlingDagStatusTekst } from '~/lib/meldekort/utils/meldekortTekster';

type Props = {
    hurtigutfylling: MeldekortHurtigutfylling;
    dato: string;
};

export const MeldekortHurtigutfyllingStatusVelger = ({ hurtigutfylling, dato }: Props) => {
    const { avbryt, velgStatusForAktivDag, hoppTilNesteDag } = hurtigutfylling;

    const velgerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const avbrytVedKlikkUtenfor = (event: MouseEvent) => {
            const target = event.target;

            if (target instanceof Node && !velgerRef.current?.contains(target)) {
                avbryt();
            }
        };

        document.addEventListener('mousedown', avbrytVedKlikkUtenfor);

        return () => document.removeEventListener('mousedown', avbrytVedKlikkUtenfor);
    }, [avbryt]);

    return (
        <VStack
            ref={velgerRef}
            gap={'space-8'}
            className={style.velger}
            /**
             * Hindrer at statusvelgeren for dagen mister fokus, slik at hurtigtastene
             * fortsatt fungerer etter et klikk i velgeren. Klikk på knappene virker som normalt.
             */
            onMouseDown={(event) => event.preventDefault()}
        >
            <BodyShort
                size={'small'}
                weight={'semibold'}
            >{`${ukedagFraDato(dato)} ${formaterDatotekst(dato)}`}</BodyShort>

            <VStack align={'start'} gap={'space-2'}>
                {meldekortDagStatusHurtigtaster.map(({ tast, status }) => (
                    <Button
                        key={tast}
                        type={'button'}
                        size={'xsmall'}
                        variant={'tertiary-neutral'}
                        icon={ikonForMeldekortbehandlingDagStatus[status]}
                        title={`${meldekortbehandlingDagStatusTekst[status]} (${tast.toUpperCase()})`}
                        onClick={() => velgStatusForAktivDag(status)}
                    >
                        <kbd className={style.tast}>{tast.toUpperCase()}</kbd>
                        {` - ${meldekortbehandlingDagStatusTekst[status]}`}
                    </Button>
                ))}
            </VStack>

            <HStack justify={'space-between'} gap={'space-4'}>
                <Button
                    type={'button'}
                    size={'xsmall'}
                    variant={'tertiary-neutral'}
                    icon={<ArrowRightIcon aria-hidden={true} />}
                    title={'Behold status og gå til neste dag (Enter)'}
                    onClick={hoppTilNesteDag}
                >
                    {'Hopp over'}
                </Button>

                <Button
                    type={'button'}
                    size={'xsmall'}
                    variant={'tertiary-neutral'}
                    icon={<XMarkIcon aria-hidden={true} />}
                    title={'Avbryt hurtigutfylling (Esc)'}
                    onClick={avbryt}
                >
                    {'Avbryt'}
                </Button>
            </HStack>
        </VStack>
    );
};
