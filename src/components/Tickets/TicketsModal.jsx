"use client";
import useTickets from "@/hooks/useTickets.js";
import TicketsForm from "./TicketsForm.jsx";
import CommonModal from "./CommonModal.jsx";

const TicketsModal = ({ employeeId }) => {
  const { showEditModal, closeModal, selectedTicket } = useTickets();

  const modalTitle = selectedTicket ? "Edit Ticket" : "Create Ticket";

  return (
    <div>
      {/* create/edit modal */}
      <CommonModal
        isOpen={showEditModal}
        onClose={closeModal}
        title={modalTitle}
        wide={"w-[45%]"}
      >
        <TicketsForm employeeId={employeeId} />
      </CommonModal>
    </div>
  );
};

export default TicketsModal;
