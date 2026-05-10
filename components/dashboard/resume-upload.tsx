'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface ResumeUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}

export function ResumeUpload({ isOpen, onClose, onSubmit }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      if (['application/pdf', 'application/msword'].includes(droppedFile.type)) {
        setFile(droppedFile);
      } else {
        alert('Please upload a PDF or Word document');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      onSubmit(file);
      setFile(null);
      onClose();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!file ? (
            <>
              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                  isDragging
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Upload size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Drop your resume here
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  or click below to browse
                </p>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <span className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition cursor-pointer">
                    Choose File
                  </span>
                </label>
              </div>

              {/* Format Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2 font-semibold">
                  Supported formats:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• PDF (.pdf)</li>
                  <li>• Microsoft Word (.doc, .docx)</li>
                  <li>• Maximum file size: 10MB</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* File Selected */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Processing Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  We&apos;ll extract your skills, experience, and education to build your
                  profile automatically.
                </p>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-black text-white hover:bg-gray-900"
              disabled={!file || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Resume'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
