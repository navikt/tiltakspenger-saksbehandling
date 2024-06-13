import { Heading } from '@navikt/ds-react';
import Link from 'next/link';

interface StegHeaderProps {
  headertekst: string;
  lovdatatekst: string;
  lovdatalenke: string;
}

const StegHeader = ({
  headertekst,
  lovdatatekst,
  lovdatalenke,
}: StegHeaderProps) => {
  return (
    <>
      <Heading size="medium" level="3">
        {headertekst}
      </Heading>
      <Link href={lovdatalenke} target="_blank" style={{ marginBottom: '1em' }}>
        {lovdatatekst}
      </Link>
    </>
  );
};

export default StegHeader;
