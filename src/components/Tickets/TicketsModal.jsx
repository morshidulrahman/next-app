"use client";
import useTickets from "@/hooks/useTickets.js";
import TicketsForm from "./TicketsForm.jsx";
import CommonModal from "./CommonModal.jsx";
import useProfileClient from "@/lib/useProfileclient.js";

const TicketsModal = () => {
  const { showEditModal, closeModal, selectedTicket } = useTickets();
  const profile = useProfileClient();

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
        <TicketsForm employeeId={profile?._id} />
      </CommonModal>
    </div>
  );
};

export default TicketsModal;
