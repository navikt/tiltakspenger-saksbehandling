import {Accordion} from "@navikt/ds-react";
import { Label } from "@navikt/ds-react";
import {MeldekortAccordions} from "../meldekort-accordions/MeldekortAccordions";

export const MeldekortTab = () => {
    return(
        <Accordion>
            <Accordion.Item>
                <Accordion.Header>
                    <Label> Uke 1 + Uke 2 </Label>
                    <Label textColor="subtle"> / 01.00.2023 - 14.00.2023 </Label>
                </Accordion.Header>
                <Accordion.Content>
                    <MeldekortAccordions></MeldekortAccordions>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
}
