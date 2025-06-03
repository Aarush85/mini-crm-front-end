import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

function BulkUploadButton({ onUpload, accept = '.csv' }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await onUpload(file);
      e.target.value = ''; // Reset file input
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <button
        onClick={handleClick}
        disabled={uploading}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? 'Uploading...' : 'Bulk Upload'}
      </button>
    </>
  );
}

export default BulkUploadButton; 