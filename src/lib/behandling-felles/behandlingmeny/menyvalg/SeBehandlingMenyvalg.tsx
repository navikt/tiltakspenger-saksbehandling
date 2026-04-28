import { ActionMenu } from '@navikt/ds-react';
import Link from 'next/link';
import { FileIcon } from '@navikt/aksel-icons';

type Props = {
    behandlingHref: string;
    tekst?: string;
};

const SeBehandlingMenyvalg = ({ behandlingHref, tekst = 'Se behandling' }: Props) => {
    return (
        <ActionMenu.Item as={Link} href={behandlingHref} icon={<FileIcon aria-hidden />}>
            {tekst}
        </ActionMenu.Item>
    );
};

export default SeBehandlingMenyvalg;
