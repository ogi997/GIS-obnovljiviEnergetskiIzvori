import {Toast} from "react-bootstrap";
import ToastContainer from 'react-bootstrap/ToastContainer';
const ToastMessage = ({header, body, show, setShow, variant}) => {
    return (
        <>
            <ToastContainer position={"bottom-end"} className={"p-3"}>
                <Toast bg={variant} onClose={() => setShow(false)} show={show} delay={5000} autohide={true}>
                    <Toast.Header closeButton={false}>
                        {header}
                    </Toast.Header>
                    <Toast.Body><strong className={"me-auto"}>{body}</strong></Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}

export default ToastMessage;
