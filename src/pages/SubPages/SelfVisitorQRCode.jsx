import React from "react";
import { FaQrcode } from "react-icons/fa";
import logo from "/vibe.png";
import ModalWrapper from "../../containers/modals/ModalWrapper";
const SelfVisitorQRCode = ({ onClose, QR }) => {
  console.log(QR);
  const downloadFile = async (qrCodePath, centerImagePath) => {
    try {
      const qrCodeResponse = await fetch(qrCodePath);
      const qrCodeBlob = await qrCodeResponse.blob();
      const qrCodeUrl = URL.createObjectURL(qrCodeBlob);

      const centerImageResponse = await fetch(centerImagePath);
      const centerImageBlob = await centerImageResponse.blob();
      const centerImageUrl = URL.createObjectURL(centerImageBlob);

      const qrCodeImage = new Image();
      qrCodeImage.src = qrCodeUrl;

      qrCodeImage.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = qrCodeImage.width;
        canvas.height = qrCodeImage.height;

        // Draw the QR code onto the canvas
        ctx.drawImage(qrCodeImage, 0, 0);

        // Create a new Image element for the center image (logo)
        const centerImage = new Image();
        centerImage.src = centerImageUrl;

        // Once the center image has loaded
        centerImage.onload = () => {
          // Calculate the logo size relative to the QR code size (e.g., 20% of QR code width)
          const logoSize = canvas.width * 0.2; // Adjust the 0.2 value to scale the logo

          // Calculate position to center the logo on the QR code
          const x = (canvas.width - logoSize) / 2;
          const y = (canvas.height - logoSize) / 2;

          // Draw a white rectangle as the background for the logo
          ctx.fillStyle = "white";
          ctx.fillRect(x, y, logoSize, logoSize);

          // Draw the center image (logo) on top of the white background
          ctx.drawImage(centerImage, x, y, logoSize, logoSize);

          // Convert canvas to blob and download
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            const fileName = "QR";
            link.download = fileName;
            link.click();

            // Cleanup URLs
            URL.revokeObjectURL(qrCodeUrl);
            URL.revokeObjectURL(centerImageUrl);
            URL.revokeObjectURL(url);
          });
        };
      };
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  console.log(QR);
  return (
    <ModalWrapper onclose={onClose}>
      <div className="mx-4 flex flex-col justify-between items-center gap-10">
        <img
          src={QR}
          alt="qr"
          width={200}
          className="border shadow-xl rounded-md"
        />
        <button
          className="px-4 w-full border-2 border-black rounded-md flex justify-center items-center gap-2 py-1"
          //   onClick={handlePrintQRCode}
          onClick={() => downloadFile(QR, logo)}
        >
          <FaQrcode />
          Print QR Code
        </button>
      </div>
    </ModalWrapper>
  );
};

export default SelfVisitorQRCode;
