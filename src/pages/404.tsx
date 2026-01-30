import { BodyShort, Box, Heading, Link, List, Page } from '@navikt/ds-react';

export default function Custom404() {
    return (
        <Page>
            <Page.Block as="main" width="2xl">
                <Box paddingBlock="space-80 space-64" data-aksel-template="404-v2">
                    <div>
                        <Heading level="1" size="large" spacing>
                            Beklager, vi fant ikke siden
                        </Heading>
                        <BodyShort>
                            Denne siden kan være slettet eller flyttet, eller det er en feil i
                            lenken.
                        </BodyShort>
                        <Box marginBlock="space-16" asChild>
                            <List>
                                <List.Item>
                                    <Link href="/">Gå til forsiden</Link>
                                </List.Item>
                            </List>
                        </Box>
                    </div>
                </Box>
            </Page.Block>
        </Page>
    );
}
