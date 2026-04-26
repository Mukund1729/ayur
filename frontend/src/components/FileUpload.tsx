import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  loading?: boolean;
  preview?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024,
  loading = false,
  preview = true
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (loading) return;
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError('');
    setSelectedFile(null);
    setPreviewUrl('');

    if (file.size > maxSize) {
      setError('File size must be less than ' + Math.round(maxSize / (1024 * 1024)) + 'MB');
      return;
    }

    const validTypes = accept.split(',').map(function(type) { return type.trim(); });
    const isValidType = validTypes.some(function(type) {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      setError('Invalid file type. Accepted types: ' + accept);
      return;
    }

    setSelectedFile(file);

    if (preview && file.type.startsWith('image/')) {
      var reader = new FileReader();
      reader.onload = function(e) {
        setPreviewUrl((e.target as FileReader).result as string);
      };
      reader.readAsDataURL(file);
    }

    onFileSelect(file);
  };

  const openFileDialog = () => {
    if (!loading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

 const openCamera = (e?: React.MouseEvent) => {
  // Agar click event aaya hai toh use rokein taaki page reload na ho
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  if (!loading && cameraInputRef.current) {
    cameraInputRef.current.click();
  }
};

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        disabled={loading}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        disabled={loading}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        className={'relative border-2 border-dashed rounded-2xl p-4 sm:p-8 text-center transition-all duration-500 active:scale-[0.98] ' +
          (dragActive
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : 'border-gray-300 hover:border-blue-400 bg-white/60') +
          (loading ? ' opacity-50 cursor-not-allowed' : ' cursor-pointer')}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {!selectedFile ? (
          <div className="space-y-4 relative z-10">
            <div className="flex justify-center">
              <div className={'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ' +
                (dragActive ? 'bg-blue-500/10' : 'bg-gray-100')}>
                <svg
                  className={'w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-500 ' + (dragActive ? 'text-blue-500' : 'text-gray-500')}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm sm:text-lg font-semibold text-gray-800">
                {loading ? 'Processing...' : 'Tap to select an image'}
              </p>
              <p className="hidden sm:block text-xs sm:text-sm text-gray-500 mt-1">
                JPG, PNG, or WEBP up to 10MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            {previewUrl && (
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 sm:max-h-40 max-w-full rounded-xl object-cover"
                  />
                </div>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl px-3 sm:px-6 py-3 sm:py-4 inline-block max-w-full">
              <p className="font-medium text-gray-800 truncate max-w-[180px] sm:max-w-xs">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              type="button"
              onClick={function(e) { e.stopPropagation(); removeFile(); }}
              disabled={loading}
              className="px-4 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 active:bg-red-100 transition-all duration-300 disabled:opacity-40 min-h-[44px]"
            >
              Remove File
            </button>
          </div>
        )}
      </div>

      {/* Camera Button */}
      <div className="mt-4">
        <button
          onClick={function(e) { e.stopPropagation(); openCamera(); }}
          disabled={loading}
          className="w-full px-4 sm:px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base min-h-[44px]"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Capture Photo</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Capture Guidelines */}
      <div className="mt-6 bg-blue-50/40 rounded-xl p-4 sm:p-5 border border-blue-100">
        <h4 className="font-semibold text-gray-800 text-base sm:text-lg mb-3">Capture Guidelines</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {[
            'Clear, well-lit oil drop image',
            'Drop pattern fully visible',
            'Avoid shadows and glare',
            'Plain, light background preferred',
            'Hold camera steady and level'
          ].map(function(tip, i) {
            return (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
