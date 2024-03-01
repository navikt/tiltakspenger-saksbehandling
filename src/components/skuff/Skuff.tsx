import { Box, Button, HStack, Heading, Spacer, VStack } from '@navikt/ds-react';
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
    <>
      <Heading size="xsmall" level="3">
        {headerTekst}
      </Heading>
      <Spacer />
      <ChevronLeftIcon title="lukk sidepanel" />
    </>
  );

  const høyreOrientertSkuff = () => (
    <>
      <ChevronRightIcon title="lukk sidepanel" className={styles.spacing} />
      <Heading size="xsmall" level="3">
        {headerTekst}
      </Heading>
    </>
  );

  return (
    <>
      {åpen ? (
        <VStack className={styles.skuff}>
          <Box
            as="button"
            aria-expanded="true"
            className={styles.heading}
            onClick={() => settÅpen(!åpen)}
          >
            {venstreOrientert ? venstreOrientertSkuff() : høyreOrientertSkuff()}
          </Box>
          {children}
        </VStack>
      ) : (
        <Box
          className={styles.lukketSkuff}
          onClick={() => settÅpen(!åpen)}
          as="button"
          aria-expanded="false"
        >
          <HStack justify="center" className={styles.lukketKnapp}>
            {venstreOrientert ? (
              <ChevronRightIcon title="åpne sidepanel" />
            ) : (
              <ChevronLeftIcon title="åpne sidepanel" />
            )}
          </HStack>
          <Heading size="xsmall" level="3" className={styles.lukketHeading}>
            {headerTekst}
          </Heading>
        </Box>
      )}
    </>
  );
};
