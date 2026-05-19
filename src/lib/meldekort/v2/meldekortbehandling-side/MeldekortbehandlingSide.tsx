import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    meldekortbehandling: MeldekortbehandlingPropsV2;
};

export const MeldekortbehandlingSide = ({ meldekortbehandling }: Props) => {
    return (
        <div>
            <h1>{`Meldekortbehandling ${meldekortbehandling.id}`}</h1>
        </div>
    );
};
