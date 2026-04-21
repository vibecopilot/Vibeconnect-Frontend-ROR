import React, { useState } from 'react';
import { IoAddCircle } from 'react-icons/io5';
import ModalWrapper from './ModalWrapper';
import { getItemInLocalStorage } from '../../utils/localStorage';
import toast from 'react-hot-toast';
import { downloadSampleAsset, importAsset } from '../../api';

const ImportAssetModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const token = getItemInLocalStorage("TOKEN")
 
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!file) {
    toast.error("Please select a file");
    return;
  }

  try {
    toast.loading("Uploading...");

    await importAsset(file,token);

    toast.dismiss();
    toast.success("File uploaded successfully");
    onClose();
  } catch (error) {
    toast.dismiss();
    console.error(error);
    toast.error("File upload failed");
  }
};

  const handleSampleDownload = async () => {
    try {
      toast.loading("Downloading sample...");

      const response = await downloadSampleAsset();

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "asset_sample.xlsx"); // file name
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Sample downloaded successfully");
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error("Failed to download sample");
    }
  };

  return (
    <ModalWrapper onclose={onClose}>
      <div className="flex flex-col justify-center">
        <h2 className="flex gap-4 items-center justify-center font-bold text-lg">
          <IoAddCircle size={20} />
          Bulk Upload
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" acceptCharset="UTF-8">
          <input name="utf8" type="hidden" value="✓" />
          <input type="hidden" name="authenticity_token" value="FLtfXHPj0C0KSMMFaa8iowACNVJZP5erTte5NUQYtrwqE9FJl9zYzqK+/kda5x4NFP2RQiggWqnMuVVOhodnJQ==" />
          <div className="form-group">
            <section className="flex flex-col gap-3">
              <p className='font-medium'>
                Drag &amp; Drop or
              </p>
              <input
                type="file"
                name="file"
                id="file"
                required
                onChange={(e) => setFile(e.target.files[0])}
              />
            </section>
          </div>
          <div className='flex justify-end gap-4 my-5 items-center'>
            <button
              type="submit"
              name="commit"
              value="Import"
              className="bg-black p-1 px-4 border-2 rounded-md text-white font-medium border-black hover:bg-white hover:text-black transition-all duration-300"
              data-disable-with="Import"
            >
              Import
            </button>
            <button
              type="button"
              onClick={handleSampleDownload}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Download Sample
            </button>
          </div>
        </form>
        {/* <div className="flex justify-center mt-4">
          <button
            className="bg-black p-1 px-4 border-2 rounded-md text-white font-medium border-black hover:bg-white hover:text-black transition-all duration-300"
            onClick={onClose}
          >
            Close
          </button>
        </div> */}
      </div>
    </ModalWrapper>
  );
}

export default ImportAssetModal;

