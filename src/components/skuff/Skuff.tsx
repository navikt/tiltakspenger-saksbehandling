import { Button, HStack, Heading, Spacer, VStack } from '@navikt/ds-react';
import styles from './Skuff.module.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

interface SkuffProps extends React.PropsWithChildren {
  venstreOrientert: Boolean;
  headerTekst: String;
}

export const Skuff = ({
  children,
  venstreOrientert,
  headerTekst,
}: SkuffProps) => {
  const [åpen, settÅpen] = useState<Boolean>(true);

  return (
    <>
      {åpen ? (
        <VStack
          className={venstreOrientert ? styles.SkuffVenstre : styles.SkuffHøyre}
        >
          <HStack className={styles.heading} onClick={() => settÅpen(!åpen)}>
            <Heading size="xsmall" level="3">
              {headerTekst}
            </Heading>
            <Spacer />
            <Button
              variant="tertiary"
              size="xsmall"
              icon={<ChevronLeftIcon title="åpne/lukk sidepanel" />}
            />
          </HStack>
          {children}
        </VStack>
      ) : (
        <VStack className={styles.lukketSkuff}>
          <Button
            variant="tertiary"
            size="xsmall"
            icon={<ChevronRightIcon title="åpne/lukk sidepanel" />}
            onClick={() => settÅpen(!åpen)}
          />
        </VStack>
      )}
    </>
  );
};
