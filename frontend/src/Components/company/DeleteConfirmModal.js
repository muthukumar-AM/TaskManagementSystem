import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmModal = ({ employee, onClose, onConfirm }) => {
    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete {employee.name}?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Yes, Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmModal;
