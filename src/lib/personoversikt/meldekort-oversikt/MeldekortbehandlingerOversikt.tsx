import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { MeldekortbehandlingerTabell } from './MeldekortbehandlingerTabell';

type Props = {
    saksnummer: string;
    meldekortbehandlinger: MeldekortbehandlingProps[];
};

export const MeldekortbehandlingerOversikt = ({ saksnummer, meldekortbehandlinger }: Props) => {
    if (meldekortbehandlinger.length === 0) {
        return (
            <Infokort variant={'info'}>
                {'Ingen tidligere meldekortbehandlinger på denne saken'}
            </Infokort>
        );
    }

    return (
        <MeldekortbehandlingerTabell
            saksnummer={saksnummer}
            meldekortbehandlinger={meldekortbehandlinger}
            medMeny={false}
        />
    );
};
