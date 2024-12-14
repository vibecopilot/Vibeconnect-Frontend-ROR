import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
import { getFolderDocumentCommon, postFileDocumentCommon, postFolderDocumentCommon } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { FaFile, FaFolder, FaPlus, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const DocumentCommon = () => {
  const userID = getItemInLocalStorage("UserId");
  const siteID = getItemInLocalStorage("SITEID");
  const themeColor = useSelector((state) => state.theme.color);

  const [formData, setFormData] = useState({ name: "", description: "", file: null });
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "Root" }]); // Default breadcrumb starting at Root
  const [parentID, setParentID] = useState(null); // Dynamically update parent ID based on breadcrumbs
  const [folders, setFolders] = useState([]); // List of folders
  const [files, setFiles] = useState([]); // List of files
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Modal states
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);

  // Fetch folders and files dynamically
  // const fetchFolderContents = async (parentId) => {
  //   try {
  //     const folderData = parentId
  //       ? [
  //           { id: 3, name: `Subfolder of ${parentId}`, type: "folder" },
  //           { id: 4, name: `Another Subfolder`, type: "folder" },
  //         ]
  //       : [
  //           { id: 1, name: "Folder 1", type: "folder" },
  //           { id: 2, name: "Folder 2", type: "folder" },
  //         ];

  //     const fileData = parentId
  //       ? [
  //           { id: 5, name: `File inside ${parentId}.txt`, type: "file" },
  //           { id: 6, name: `Document.pdf`, type: "file" },
  //         ]
  //       : [
  //           { id: 7, name: "File 1.txt", type: "file" },
  //           { id: 8, name: "File 2.pdf", type: "file" },
  //         ];

  //     setFolders(folderData);
  //     setFiles(fileData);
  //   } catch (error) {
  //     console.error("Failed to fetch contents", error);
  //     toast.error("Failed to fetch contents");
  //   }
  // };
  const fetchFolderDocumentCommon = async () => {
    try {
      // Perform the API request using the predefined method
      const response = await getFolderDocumentCommon();
  
      // Check if the response is successful
      if (response.data.success) {
        const { folders, documents } = response.data;
  
        // Format and return the folders and files
        const folderData = folders.map((folder) => ({
          id: folder.id,
          name: folder.name,
          parent_id: folder.parent_id,
          structure: folder.structure,
          description: folder.description,
          date_of_upload: folder.date_of_upload,
          site_id: folder.site_id,
          uploaded_by: folder.uploaded_by,
          folder_type: folder.folder_type,
          unit_id: folder.unit_id,
          created_at: folder.created_at,
          updated_at: folder.updated_at,
          type: 'folder',
        }));
  
        const fileData = documents.map((file) => ({
          id: file.id,
          name: file.name,
          type: 'file',
        }));
  
        return { folders: folderData, files: fileData };
      } else {
        throw new Error(response.data.message || 'Failed to retrieve folder contents');
      }
    } catch (error) {
      console.error('Error fetching folder and document contents:', error);
      toast.error('Failed to fetch folder and document contents');
      return { folders: [], files: [] };
    }
  };
  
  // Update parent ID and fetch contents when breadcrumbs change
  // useEffect(() => {
  //   const currentParentID = breadcrumbs[breadcrumbs.length - 1]?.id;
  //   setParentID(currentParentID);
  //   fetchFolderContents(currentParentID);
  // }, [breadcrumbs]);
  useEffect(() => {
    fetchFolderDocumentCommon().then((data) => {
      setFolders(data.folders);
      setFiles(data.files);
    });
  }, []);

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
    // sendData.append("folder[parent_id]", 12);
    sendData.append("folder[structure]", "folder");
    // sendData.append("folder[description]", formData.description);
    sendData.append("folder[uploaded_by]", userID);
    sendData.append("folder[site_id]", siteID);

    try {
      const resp = await postFolderDocumentCommon(sendData);
      // toast.success("Folder Created Successfully");
     
     
      setIsModalOpen(false);
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
    sendData.append("folder_document[folder_id]", 12);
    sendData.append("folder_document[content]", "file");

    // Correcting the flat_document content structure based on the example JSON
    sendData.append("folder_document[image]", formData.file); // Assuming `formData.file` is the file blob
    // formData.unitIds.forEach((id) => sendData.append("unit_ids[]", id)); 
  
    sendData.append("folder_document[uploaded_by]", userID);
    sendData.append("folder_document[site_id]", siteID);
  
    try {
      const resp = await postFileDocumentCommon(sendData);
      toast.success("File uploaded successfully");
      setFormData({ name: "", description: "", file: null }); // Reset form
      setIsUploadFileModalOpen(false); // Close the modal
      fetchFolderContents(parentID); // Refresh contents
      console.log(resp);
    } catch (error) {
      console.error("Upload error:", error);
      
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
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 flex items-center gap-2 text-white py-2 px-4 rounded-md " style={{ background: themeColor }}
      >
        <FaPlus/>
        Create Folder
      </button>

      {/* Upload File Button */}
      <button
        onClick={() => setIsUploadFileModalOpen(true)}
        className="bg-blue-500 flex items-center gap-2 text-white py-2 px-4 rounded-md" style={{ background: themeColor }}
      >
        <FaUpload/>
        Upload File
      </button>
</div>
      {/* Folder and File List */}
      <div className="bg-white  rounded-lg   ">
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
                  <FaFolder className="text-4xl text-yellow-400 mb-2" />
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
      { isModalOpen && (
       <div className="fixed inset-0 flex items-center justify-center z-50">
      
       <div className="bg-white  rounded-lg shadow-lg p-4 relative z-10">
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
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 text-white py-2 px-4 rounded-md ml-2" style={{ background: themeColor }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {isUploadFileModalOpen && (
         <div className="fixed inset-0 flex items-center justify-center z-50">
      
         <div className="bg-white  rounded-lg shadow-lg p-4 relative z-10">
            <h2 className="text-xl font-semibold mb-4">Upload File</h2>
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
   
    </div>
  );
};

export default DocumentCommon;
