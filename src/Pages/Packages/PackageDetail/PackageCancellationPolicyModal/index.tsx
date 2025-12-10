import React from "react";
import { Modal, Timeline } from "antd";

interface PackageCancellationPolicyModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const PackageCancellationPolicyModal: React.FC<PackageCancellationPolicyModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  return (
    <>
      {" "}
      <Modal
        title="Cancellation Policy"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: "20px" }}>
          {/* <p>
            You can cancel up to 24 hours in advance of the experience for a
            full refund.
          </p> */}
          <Timeline>
            <Timeline.Item>
              For a full refund, you must cancel at least 24 hours after the
              booking of package.
            </Timeline.Item>
            <Timeline.Item>
              If you cancel after the 24 hours of booking , there will be no
              refund of amount.
            </Timeline.Item>
            <Timeline.Item>
              If cancelled by travel organization due to bad weather or natural
              claimities, full amount will be refunded.
            </Timeline.Item>
            {/* <Timeline.Item>
              Cut-off times are based on the experience's local time.
            </Timeline.Item>
            <Timeline.Item>
              This experience requires good weather. If it's canceled due to
              poor weather, you'll be offered a different date or a full refund.
            </Timeline.Item>
            <Timeline.Item>
              This experience requires a minimum number of travelers. If it's
              canceled because the minimum isn't met, you'll be offered a
              different date/experience or a full refund.
            </Timeline.Item> */}
          </Timeline>
        </div>
      </Modal>
    </>
  );
};

export default PackageCancellationPolicyModal;
