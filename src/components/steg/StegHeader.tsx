import { Heading } from '@navikt/ds-react';
import Link from 'next/link';

interface StegHeaderProps {
  headertekst: string;
  lovdatatekst: string;
  lovdatalenke: string;
  paragraf: string;
}

const StegHeader = ({
  headertekst,
  lovdatatekst,
  lovdatalenke,
  paragraf,
}: StegHeaderProps) => {
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

export default StegHeader;
