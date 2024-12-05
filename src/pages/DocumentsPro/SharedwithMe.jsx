import React, { useState } from 'react';
import { FaFolder, FaFileAlt } from 'react-icons/fa'; // Import icons from react-icons

const initialFolders = [
  {
    name: 'TCS B Unit',
    files: ['IMG_1754.JPG', 'Strategy_copy.xlsx'],
    subfolders: [
      { name: 'FM Matrix Manual', files: [], subfolders: [] },
      { name: 'Important Document', files: [], subfolders: [] },
      { name: 'Mittu', files: [], subfolders: [] }
    ]
  },
  {
    name: 'Mittu',
    files: ['IMG_1754.JPG', 'Strategy_copy.xlsx'],
    subfolders: [
      { name: 'FM Matrix Manual', files: [], subfolders: [] },
      { name: 'Important Document', files: [], subfolders: [] },
      { name: 'Mittu', files: [], subfolders: [] }
    ]
  }
];

const f = ['IMG_1754.JPG']; // Files in the Root folder

const SharedwithMe = () => {
  const [path, setPath] = useState([{ name: 'Root', subfolders: initialFolders, files: f }]);
  const [currentFiles, setCurrentFiles] = useState(f); // Show Root files by default
  const [size, setSize] = useState('medium'); // Default folder/file size

  // Navigate to a folder in the breadcrumb
  const navigateTo = (index) => {
    const newPath = path.slice(0, index + 1);
    setPath(newPath);
    setCurrentFiles(newPath[newPath.length - 1].files || []);
  };

  // Navigate into a subfolder
  const navigateToFolder = (folder) => {
    const newPath = [...path, folder];
    setPath(newPath);
    setCurrentFiles(folder.files || []);
  };

  // Update folder/file size
  const handleSizeChange = (newSize) => {
    setSize(newSize);
  };

  // Dynamic class names based on size
  const sizeClasses = {
    small: 'text-base p-1',
    medium: 'text-lg p-2',
    large: 'text-xl p-3'
  };

  return (
    <div className="p-4">
      {/* Breadcrumb Navigation */}
      {path.length > 0 && (
        <nav className="breadcrumb mb-4">
          <ul className="flex items-center space-x-2">
            {path.map((folder, index) => (
              <li key={index} className="flex items-center">
                <button
                  onClick={() => navigateTo(index)}
                  className="font-medium hover:underline"
                >
                  {folder.name}
                </button>
                {index < path.length - 1 && <span className="mx-2">/</span>}
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Size Selection */}
      <div className="flex justify-end">
        {/* <span className="font-semibold">Choose Folder/File Size: </span> */}
        <button
          onClick={() => handleSizeChange('small')}
          className={`px-3 py-1 rounded ${size === 'small' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Small
        </button>
        <button
          onClick={() => handleSizeChange('medium')}
          className={`px-3 py-1 rounded ${size === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Medium
        </button>
        <button
          onClick={() => handleSizeChange('large')}
          className={`px-3 py-1 rounded ${size === 'large' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Large
        </button>
      </div>

      {/* Subfolders Section */}
      <div className="folders mb-4">
        <h2 className=" text-lg mb-2">Folders</h2>
        {path[path.length - 1].subfolders.length > 0 ? (
          <ul className="list-disc grid grid-cols-6 gap-4   pl-6 ">
           
            {path[path.length - 1].subfolders.map((subfolder, index) => (
                 <div className=' border p-4 rounded shadow'>
              <li key={index} className={`mb-1 flex flex-col items-center space-x-2 ${sizeClasses[size]}`}>
                <FaFolder className="text-yellow-500" size={40}/> {/* Folder icon */}
                <button
                  onClick={() => navigateToFolder(subfolder)}
                  className=""
                >
                  {subfolder.name}
                </button>
              </li>
              </div>
            ))}

          </ul>
        ) : (
          <p className="text-gray-500">No folders available.</p>
        )}
      </div>

      {/* Files Section */}
      <div className="files">
        <h2 className=" text-lg mb-2">Files</h2>
        {currentFiles.length > 0 ? (
          <ul className="list-disc grid grid-cols-6 gap-4 pl-6">
            {currentFiles.map((file, index) => (
                 <div className=' border p-4 rounded shadow'>
              <li key={index} className={`mb-1 flex flex-col items-center space-x-2 ${sizeClasses[size]}`}>
                <FaFileAlt className="text-gray-700" size={40}/> {/* File icon */}
                <span>{file}</span>
              </li>
              </div>
            ))}
            
          </ul>
        ) : (
          <p className="text-gray-500">No files available.</p>
        )}
      </div>
    </div>
  );
};

export default SharedwithMe;
