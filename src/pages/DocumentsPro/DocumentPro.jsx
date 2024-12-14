import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
import { postFileDocumentCommon, postFolderDocumentCommon } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { FaFile, FaFolder, FaPlus, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";

const DocumentPro = () => {
  const userID = getItemInLocalStorage("UserId");
  const siteID = getItemInLocalStorage("SITEID");
  const themeColor = useSelector((state) => state.theme.color);

  const [formData, setFormData] = useState({ name: "", description: "", file: null });
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "Root" }]); // Default breadcrumb starting at Root
  const [parentID, setParentID] = useState(null); // Dynamically update parent ID based on breadcrumbs
  const [folders, setFolders] = useState([]); // List of folders
  const [files, setFiles] = useState([]); // List of files

  // Modal states
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);

  // Fetch folders and files dynamically
  const fetchFolderContents = async (parentId) => {
    try {
      const folderData = parentId
        ? [
            { id: 3, name: `Subfolder of ${parentId}`, type: "folder" },
            { id: 4, name: `Another Subfolder`, type: "folder" },
          ]
        : [
            { id: 1, name: "Folder 1", type: "folder" },
            { id: 2, name: "Folder 2", type: "folder" },
          ];

      const fileData = parentId
        ? [
            { id: 5, name: `File inside ${parentId}.txt`, type: "file" },
            { id: 6, name: `Document.pdf`, type: "file" },
          ]
        : [
            { id: 7, name: "File 1.txt", type: "file" },
            { id: 8, name: "File 2.pdf", type: "file" },
          ];

      setFolders(folderData);
      setFiles(fileData);
    } catch (error) {
      console.error("Failed to fetch contents", error);
      toast.error("Failed to fetch contents");
    }
  };

  // Update parent ID and fetch contents when breadcrumbs change
  useEffect(() => {
    const currentParentID = breadcrumbs[breadcrumbs.length - 1]?.id;
    setParentID(currentParentID);
    fetchFolderContents(currentParentID);
  }, [breadcrumbs]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  // Navigate to a breadcrumb
  const navigateToBreadcrumb = (index) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
  };

  // Open a folder and update breadcrumbs
  const openFolder = (folder) => {
    setBreadcrumbs((prev) => [...prev, folder]);
  };

  // Create a new folder
  const createFolder = async () => {
    const sendData = new FormData();
    sendData.append("folder[name]", formData.name);
    sendData.append("folder[parent_id]", parentID);
    sendData.append("folder[structure]", "folder");
    // sendData.append("folder[description]", formData.description);
    sendData.append("folder[uploaded_by]", userID);
    sendData.append("folder[site_id]", siteID);

    try {
      const resp = await postFolderDocumentCommon(sendData);
      toast.success("Folder Created Successfully");
      setFormData({ name: "", description: "" }); // Reset form
      setIsCreateFolderModalOpen(false); // Close the modal
      fetchFolderContents(parentID); // Refresh contents
      console.log(resp);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create folder");
    }
  };

  // Upload file to the selected folder
  const uploadFile = async () => {
    if (!formData.file) {
      toast.error("Please select a file to upload");
      return;
    }

    const sendData = new FormData();
    sendData.append("file[name]", formData.name);
    sendData.append("file[folder_id]", parentID);
    sendData.append("file[file]", formData.file);
    sendData.append("file[uploaded_by]", userID);
    sendData.append("file[site_id]", siteID);

    try {
      const resp = await postFileDocumentCommon(sendData);
      toast.success("File Uploaded Successfully");
      setFormData({ name: "", description: "", file: null }); // Reset form
      setIsUploadFileModalOpen(false); // Close the modal
      fetchFolderContents(parentID); // Refresh contents
      console.log(resp);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload file");
    }
  };

  return (
    <div className="p-6  min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="flex  mb-2">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.id} className="flex items-center">
            <button
              onClick={() => navigateToBreadcrumb(index)}
              className="hover:underline text-base"
            >
              {crumb.name}
            </button>
            {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
          </span>
        ))}
      </nav>

<div className="flex justify-end gap-2 mb-2">
   {/* Create Folder Button */}
   <button
        onClick={() => setIsCreateFolderModalOpen(true)}
        className="bg-blue-500 flex items-center gap-2 text-white py-2 px-4 rounded-md " style={{ background: themeColor }}
      >
       <FaPlus size={15}/> Create Folder
      </button>

      {/* Upload File Button */}
      <button
        onClick={() => setIsUploadFileModalOpen(true)}
        className="bg-blue-500 flex items-center gap-2 text-white py-2 px-4 rounded-md" style={{ background: themeColor }}
      >

      <FaUpload size={15}/>
        Upload File
      </button>
</div>
      {/* Folder and File List */}
      <div className="bg-white  rounded-lg    ">
        {/* <h2 className="text-lg font-semibold mb-4">Contents</h2> */}
        <div className="flex flex-col space-y-2">
          {folders.length === 0 && files.length === 0 && <p>No items found.</p>}

          <p className="text-xl font-semibold  text-gray-700">Folders</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {folders.map((folder) => (
             
                <div
                  key={folder.id}
                  onClick={() => openFolder(folder)}
                  className="flex flex-col items-center p-4 bg-gray-100 rounded-lg cursor-pointer transition duration-200 hover:bg-gray-200"
                >
                  <FaFolder  className="text-4xl text-yellow-400 mb-2"/>
                  <p className="text-sm font-medium text-gray-800 text-center"> {folder.name}</p>
                </div>
             
            ))}
          </div>

          <p className="text-xl font-semibold mb-4 text-gray-700">Files</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file) => (
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg cursor-pointer transition duration-200 hover:bg-gray-200" key={file.id}>
                
                  <FaFile className="text-4xl text-blue-400 mb-2" />
                  <p className="text-sm font-medium text-gray-800 text-center"> {file.name} </p>
                
              </div>
            ))}
          </div>
        </div>
      </div>

     

      {/* Create Folder Modal */}
      {isCreateFolderModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-semibold mb-4">Create Folder</h2>
            <input
              type="text"
              name="name"
              placeholder="Folder Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
            {/* <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded-md"
            /> */}
            <button
              onClick={createFolder}
              className="bg-blue-500 text-white py-2 px-4 rounded-md" style={{ background: themeColor }}
            >
              Create Folder
            </button>
            <button
              onClick={() => setIsCreateFolderModalOpen(false)}
              className="bg-red-500 text-white py-2 px-4 rounded-md ml-2" style={{ background: themeColor }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {isUploadFileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-semibold mb-4"> File</h2>
            {/* <input
              type="text"
              name="name"
              placeholder="File Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded-md"
            /> */}
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
            <button
              onClick={uploadFile}
              className="bg-blue-500 text-white py-2 px-4 rounded-md" style={{ background: themeColor }}
            >
              Upload File
            </button>
            <button
              onClick={() => setIsUploadFileModalOpen(false)}
              className="bg-red-500 text-white py-2 px-4 rounded-md ml-2" style={{ background: themeColor }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal Styles */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default DocumentPro;
