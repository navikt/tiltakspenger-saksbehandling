import { Heading } from '@navikt/ds-react';
import Link from 'next/link';

interface VilkårHeaderProps {
    headertekst: string;
    lovdatatekst: string;
    lovdatalenke: string;
    paragraf: string;
}

const VilkårHeader = ({ headertekst, lovdatatekst, lovdatalenke, paragraf }: VilkårHeaderProps) => {
    return (
        <>
            <Heading size="medium" level="3">
                {headertekst}
            </Heading>
            <Link href={lovdatalenke} target="_blank">
                {`Tiltakspengeforskriften ${paragraf} ${lovdatatekst}`}
            </Link>
        </>
    );
};

export default VilkårHeader;
