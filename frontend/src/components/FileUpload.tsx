import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  disabled?: boolean;
}

function FileUpload({ onUpload, accept = 'image/*', multiple = false, label, disabled = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/v1/upload/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      let fileUrl = result.data.url;
      
      // Backend'den gelen URL: /uploads/projects/filename.jpg
      // Vite proxy /uploads'i backend'e yönlendiriyor
      // URL'i doğrudan kullanabiliriz
      setUploadedFile(fileUrl);
      onUpload(fileUrl);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Resim yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          color: '#1d263b',
          fontSize: '0.875rem',
        }}>
          {label}
        </label>
      )}
      
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#16a34a' : disabled ? '#d1d5db' : '#9ca3af'}`,
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: isDragging ? '#f3f4f6' : disabled ? '#f9fafb' : 'white',
          transition: 'all 0.2s',
          position: 'relative',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        {uploading ? (
          <div>
            <span className="material-symbols-outlined" style={{
              fontSize: '3rem',
              color: '#16a34a',
              display: 'block',
              marginBottom: '1rem',
              animation: 'spin 1s linear infinite',
            }}>
              upload
            </span>
            <p style={{ margin: 0, color: '#16a34a', fontWeight: '600' }}>
              Yükleniyor...
            </p>
          </div>
        ) : uploadedFile ? (
          <div>
            <span className="material-symbols-outlined" style={{
              fontSize: '3rem',
              color: '#10b981',
              display: 'block',
              marginBottom: '1rem',
            }}>
              check_circle
            </span>
            <p style={{ margin: 0, color: '#10b981', fontWeight: '600' }}>
              Resim yüklendi!
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
              Yeni resim için tekrar tıklayın veya sürükleyin
            </p>
            {uploadedFile && (
              <img
                src={uploadedFile}
                alt="Uploaded preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '150px',
                  marginTop: '1rem',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            )}
          </div>
        ) : (
          <div>
            <span className="material-symbols-outlined" style={{
              fontSize: '3rem',
              color: disabled ? '#9ca3af' : '#16a34a',
              display: 'block',
              marginBottom: '1rem',
            }}>
              cloud_upload
            </span>
            <p style={{
              margin: '0 0 0.5rem 0',
              color: disabled ? '#9ca3af' : '#374151',
              fontWeight: '600',
            }}>
              Resim sürükleyip bırakın veya tıklayarak seçin
            </p>
            <p style={{
              margin: 0,
              color: '#6b7280',
              fontSize: '0.875rem',
            }}>
              PNG, JPG, GIF, WebP (Max 10MB)
            </p>
            <p style={{
              margin: '0.5rem 0 0 0',
              color: '#9ca3af',
              fontSize: '0.75rem',
            }}>
              Mobil cihazlarda da çalışır
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;

