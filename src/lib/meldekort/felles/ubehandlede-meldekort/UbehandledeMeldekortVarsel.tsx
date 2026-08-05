import { HStack, VStack } from '@navikt/ds-react';
import { MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { MeldeperiodeSkjema } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContextTyper';
import { finnUbehandledeMeldekort } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { brukersMeldekortInnsendingstypeTekst } from '~/lib/meldekort/utils/tekster';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { useSak } from '~/lib/sak/SakContext';
import { meldeperiodeUrl } from '~/utils/urls';
import { formaterMeldeperiode } from '~/utils/date';

import style from './UbehandledeMeldekortVarsel.module.css';

type Props = {
    meldeperiodekjeder: MeldeperiodekjedeProps[];
    /** Meldeperioder som allerede er med i en pågående behandling, og derfor ikke skal telles med */
    skjema?: MeldeperiodeSkjema[];
};

export const UbehandledeMeldekortVarsel = ({ meldeperiodekjeder, skjema }: Props) => {
    const { saksnummer } = useSak().sak;

    const ubehandlede = finnUbehandledeMeldekort(meldeperiodekjeder, skjema);

    if (ubehandlede.length === 0) {
        return null;
    }

    const harFlere = ubehandlede.length > 1;

    const headerTekst = `Det finnes ${ubehandlede.length} meldeperiode${harFlere ? 'r' : ''} med ${harFlere ? 'ubehandlede' : 'ubehandlet'} meldekort på saken:`;

    return (
        <Infokort variant={'advarsel'} header={headerTekst} size={'small'}>
            <VStack as={'ul'} gap={'space-4 space-16'} className={style.liste}>
                {ubehandlede
                    .toSorted((a, b) => (a.periode.fraOgMed < b.periode.fraOgMed ? -1 : 1))
                    .map((kjede) => (
                        <HStack as={'li'} key={kjede.id} gap={'space-8'} align={'center'}>
                            <InternLenke href={meldeperiodeUrl(saksnummer, kjede.periode)}>
                                {`${formaterMeldeperiode(kjede.periode)}`}
                            </InternLenke>
                            {` - ${brukersMeldekortInnsendingstypeTekst(kjede.brukersMeldekortStatus)}`}
                        </HStack>
                    ))}
            </VStack>
        </Infokort>
    );
};
