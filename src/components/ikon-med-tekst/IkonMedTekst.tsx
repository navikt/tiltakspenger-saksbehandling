import React from 'react';
import styles from './IkonMedTekst.module.css';

interface IkonMedTekstProps {
  iconRenderer: () => React.ReactNode;
  text: string;
  className?: string;
}

const IkonMedTekst = ({ className, iconRenderer, text }: IkonMedTekstProps) => (
  <span className={className}>
    <div className={styles.ikonMedTekst__ikon}>{iconRenderer()}</div>
    <span className={styles.ikonMedTekst__tekst}>{text}</span>
  </span>
);

export default IkonMedTekst;
