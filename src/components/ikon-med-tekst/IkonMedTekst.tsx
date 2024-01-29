import React from 'react';
import styles from './IkonMedTekst.module.css';
import { BodyShort, HStack } from '@navikt/ds-react';

interface IkonMedTekstProps {
  iconRenderer: () => React.ReactNode;
  text: string;
  weight?: 'regular' | 'semibold';
  className?: string;
}

const IkonMedTekst = ({
  className,
  iconRenderer,
  text,
  weight = 'regular',
}: IkonMedTekstProps) => (
  <HStack className={className} align="center" gap="3" wrap={false}>
    <HStack className={styles.ikonMedTekst__icon}>{iconRenderer()}</HStack>
    <BodyShort weight={weight}>{text}</BodyShort>
  </HStack>
);

export default IkonMedTekst;
