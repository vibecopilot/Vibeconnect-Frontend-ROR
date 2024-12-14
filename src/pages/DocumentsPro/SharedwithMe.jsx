import React, { useState } from 'react';
import { FaFolder, FaFileAlt, FaFile } from 'react-icons/fa'; // Import icons from react-icons

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
  const [size, setSize] = useState('small'); // Default folder/file size

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
    small: 'text-sm p-1',
    medium: 'text-base p-2',
    large: 'text-lg p-3'
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
      {/* <div className="flex justify-end">
       
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
      </div> */}

      {/* Subfolders Section */}
      <div className="folders mb-4">
        <h2 className=" text-xl font-semibold  text-gray-700 mb-4">Folders</h2>
        {path[path.length - 1].subfolders.length > 0 ? (
          <ul className="list-disc grid grid-cols-6 gap-4   ">
           
            {path[path.length - 1].subfolders.map((subfolder, index) => (
                 <div className=' flex flex-col items-center p-4 bg-gray-100 rounded-lg cursor-pointer transition duration-200 hover:bg-gray-200'>
              <li key={index} className={`mb-1 flex flex-col items-center space-x-2 ${sizeClasses[size]}`}>
                <FaFolder className="text-4xl text-yellow-400 mb-2"/> {/* Folder icon */}
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
        <h2 className=" text-xl font-semibold  text-gray-700 mb-4">Files</h2>
        {currentFiles.length > 0 ? (
          <ul className="list-disc grid grid-cols-6 gap-4 ">
            {currentFiles.map((file, index) => (
                 <div className=' flex flex-col items-center p-4 bg-gray-100 rounded-lg cursor-pointer transition duration-200 hover:bg-gray-200'>
              <li key={index} className={`mb-1 flex flex-col items-center space-x-2 ${sizeClasses[size]}`}>
                <FaFile className="text-4xl text-blue-400 mb-2"/> {/* File icon */}
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
