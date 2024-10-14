import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import FileViewer from "react-file-viewer";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfViewer = ({ fileUrl, onClose }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Helper function to get the file type
  const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    return extension;
  };

  const fileType = getFileType(fileUrl);

  const renderViewer = () => {
    switch (fileType) {
      case "pdf":
        return (
          <div className="pdf-viewer h-[600px] overflow-y-auto">
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
            >
              <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
          </div>
        );

      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <img src={fileUrl} alt="Preview" className="w-full h-auto" />
        );

      case "xlsx":
      case "xls":
      case "csv":
        return (
          <div className="h-[600px] overflow-y-auto">
            <FileViewer
              fileType="xlsx"
              filePath={fileUrl}
              onError={(e) => console.log(e)}
            />
          </div>
        );

      case "doc":
      case "docx":
        return (
          <div className="h-[600px] overflow-y-auto">
            <FileViewer
              fileType="docx"
              filePath={fileUrl}
              onError={(e) => console.log(e)}
            />
          </div>
        );

      default:
        return <div>Unsupported file type</div>;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-xl hide-scrollbar w-[50rem] max-h-[95%] overflow-y-auto">
        <div className="flex justify-between mb-4 items-center">
          <h3 className="font-semibold">Preview Document</h3>
          <button
            onClick={onClose}
            className="border-2 rounded-full border-red-400 text-red-400 px-4 p-1"
          >
            Close
          </button>
        </div>
        {renderViewer()}
      </div>
    </div>
  );
};

export default PdfViewer;
