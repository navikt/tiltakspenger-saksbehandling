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

  const venstreOrientertSkuff = () => (
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
  );

  const høyreOrientertSkuff = () => (
    <HStack className={styles.heading} gap="2" onClick={() => settÅpen(!åpen)}>
      <Button
        variant="tertiary"
        size="xsmall"
        icon={<ChevronRightIcon title="åpne/lukk sidepanel" />}
      />
      <Heading size="xsmall" level="3">
        {headerTekst}
      </Heading>
    </HStack>
  );

  return (
    <>
      {åpen ? (
        <VStack className={styles.skuff}>
          {venstreOrientert ? venstreOrientertSkuff() : høyreOrientertSkuff()}
          {children}
        </VStack>
      ) : (
        <VStack className={styles.lukketSkuff}>
          <Button
            variant="tertiary"
            size="xsmall"
            icon={
              venstreOrientert ? (
                <ChevronRightIcon title="åpne/lukk sidepanel" />
              ) : (
                <ChevronLeftIcon title="åpne/lukk sidepanel" />
              )
            }
            onClick={() => settÅpen(!åpen)}
          />
        </VStack>
      )}
    </>
  );
};
