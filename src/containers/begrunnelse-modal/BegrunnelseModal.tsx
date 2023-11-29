import { Button, Modal, Select } from "@navikt/ds-react";
import {RefObject, useRef, useState} from "react";
import toast from "react-hot-toast";
import {useSWRConfig} from "swr";

interface BegrunnelseModalProps {
    behandlingid: string;
    ref: RefObject<HTMLDialogElement>

}

const alternativer = [
    "Dette er et alternativ",
    "Dette er et annet alternativ",
]

const BegrunnelseModal = ({behandlingid, ref} : BegrunnelseModalProps) => {
    const mutator = useSWRConfig().mutate;
    const [begrunnelse, setBegrunnelse] = useState<string>('');

    const lukkModal = () => {
        ref.current?.close();
    }

    const håndterSendTilbakeMedBegrunnelse = () => {
        const res = fetch(`/api/behandling/sendtilbake/${behandlingid}`, {
            method: 'POST',
            body: JSON.stringify({begrunnelse: begrunnelse}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            mutator(`/api/behandling/${behandlingid}`).then(() => {
                toast('Behandling sendt tilbake til saksbehandler');
            });
        });
    }

    return (
        <div>
            <Button onClick={() => ref.current?.showModal()}>Åpne modal</Button>

            <Modal ref={ref} header={{ heading: "Skjema" }} width={400} >
                <Modal.Body>
                    <Select label="Velg begrunnelse">
                        {alternativer.map((alternativ, index) => (
                            <option key={`alternativ-${index}`} value={alternativ}>{alternativ}</option>
                        ))}
                    </Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button form="skjema">Send</Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => håndterSendTilbakeMedBegrunnelse()}
                    >
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BegrunnelseModal;