import { Modal } from "react-bootstrap";

export default function LoadingPage(props) {
  return (
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={true}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Loading, please be patient
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center py-5">
        <h2 className="loader-container text-center">
          <span className="bg-danger circle"></span>
          <span className="bg-danger circle"></span>
          <span className="bg-danger circle"></span>
          <span className="bg-danger circle"></span>
        </h2>
      </Modal.Body>
    </Modal>
  );
}
