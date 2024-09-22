import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SuccessModal = ({ show, onClose }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Task updated successfully!
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SuccessModal;
