import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  UploadCloud, 
  CheckCircle, 
  Copy, 
  Calendar, 
  AlertCircle,
  RefreshCw,
  Share2,
  Check
} from 'lucide-react';

export default function CreateAlbumModal({ isOpen, onClose, onAlbumCreated, onOpenAlbum }) {
  const [step, setStep] = useState(1); // 1: Details, 2: Upload, 3: Share
  const [albumData, setAlbumData] = useState({
    name: '',
    clientName: '',
    weddingDate: '',
    description: ''
  });
  const [createdAlbum, setCreatedAlbum] = useState(null);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusList, setUploadStatusList] = useState([]);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (createdAlbum?.clientToken) {
      const shareUrl = `${window.location.origin}?token=${createdAlbum.clientToken}`;
      QRCode.toDataURL(shareUrl, { width: 140, margin: 1, color: { dark: '#111111', light: '#FFFFFF' } })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error('QR code generation error:', err));
    }
  }, [createdAlbum]);

  if (!isOpen) return null;

  const handleCreateDetails = async (e) => {
    e.preventDefault();
    if (!albumData.name.trim() || !albumData.clientName.trim()) {
      setErrorMsg('Please enter both Album Name and Client Name.');
      return;
    }
    setErrorMsg('');

    try {
      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(albumData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create album');

      setCreatedAlbum(data);
      if (onAlbumCreated) onAlbumCreated(data);
      setStep(2); // Move to upload step
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleFilesSelected = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(file => file.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    setFilesToUpload(prev => [...prev, ...validFiles]);

    const initialStatuses = validFiles.map((file, i) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      status: 'pending', // 'pending' | 'uploading' | 'completed' | 'failed'
      preview: URL.createObjectURL(file)
    }));
    setUploadStatusList(prev => [...prev, ...initialStatuses]);
  };

  const handleStartUpload = async () => {
    if (filesToUpload.length === 0) {
      // User chose to skip photos for now, jump to share
      setStep(3);
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    const formData = new FormData();
    filesToUpload.forEach(file => {
      formData.append('photos', file);
    });

    try {
      // Simulate granular progress indicator for realism
      let progress = 10;
      setUploadProgress(progress);
      const interval = setInterval(() => {
        progress = Math.min(progress + 15, 90);
        setUploadProgress(progress);
      }, 300);

      const res = await fetch(`/api/albums/${createdAlbum.id}/photos`, {
        method: 'POST',
        body: formData
      });

      clearInterval(interval);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload photos');

      setUploadProgress(100);
      setUploadStatusList(prev => prev.map(item => ({ ...item, status: 'completed' })));
      setIsUploading(false);

      setTimeout(() => {
        setStep(3); // Move to Share step
      }, 600);
    } catch (err) {
      setIsUploading(false);
      setErrorMsg(err.message);
      setUploadStatusList(prev => prev.map(item => ({ ...item, status: 'failed' })));
    }
  };

  const handleCopyLink = () => {
    if (!createdAlbum?.clientToken) return;
    const shareUrl = `${window.location.origin}?token=${createdAlbum.clientToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!createdAlbum?.clientToken) return;
    const shareUrl = `${window.location.origin}?token=${createdAlbum.clientToken}`;
    const text = encodeURIComponent(`Hi ${createdAlbum.clientName}, your wedding photo collection "${createdAlbum.name}" is ready for selection! Please view and select your favorites here: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleResetAndClose = () => {
    setStep(1);
    setAlbumData({ name: '', clientName: '', weddingDate: '', description: '' });
    setCreatedAlbum(null);
    setFilesToUpload([]);
    setUploadStatusList([]);
    setUploadProgress(0);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {step === 1 && 'Create New Album'}
            {step === 2 && 'Upload Photos'}
            {step === 3 && 'Share Album'}
          </h2>
          <button className="modal-close-btn" onClick={handleResetAndClose}>
            <X size={18} />
          </button>
        </div>

        {/* Stepper Navigation */}
        <div className="stepper-nav">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span>Album Details</span>
          </div>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span>Upload Photos</span>
          </div>
          <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span>Review & Share</span>
          </div>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div style={{
            margin: '16px 24px 0',
            padding: '10px 14px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            color: '#B91C1C',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ========================================================
            STEP 1: ALBUM DETAILS
           ======================================================== */}
        {step === 1 && (
          <form onSubmit={handleCreateDetails}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Album Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Zara & Ahmed Wedding"
                  value={albumData.name}
                  onChange={e => setAlbumData({ ...albumData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Zara & Ahmed"
                  value={albumData.clientName}
                  onChange={e => setAlbumData({ ...albumData, clientName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Wedding Date</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 12 Jan 2026"
                    value={albumData.weddingDate}
                    onChange={e => setAlbumData({ ...albumData, weddingDate: e.target.value })}
                  />
                  <Calendar 
                    size={16} 
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description (Optional)</label>
                <textarea
                  className="form-input"
                  style={{ height: '76px', padding: '10px 14px', resize: 'none' }}
                  placeholder="Add notes about this album, ceremony details, instructions for client..."
                  value={albumData.description}
                  onChange={e => setAlbumData({ ...albumData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={handleResetAndClose}>
                Cancel
              </button>
              <button type="submit" className="btn-gold">
                Next →
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            STEP 2: UPLOAD PHOTOS
           ======================================================== */}
        {step === 2 && (
          <div>
            <div className="modal-body">
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={e => handleFilesSelected(e.target.files)}
              />

              <div 
                className="dropzone-container"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files) {
                    handleFilesSelected(e.dataTransfer.files);
                  }
                }}
              >
                <UploadCloud className="dropzone-icon" />
                <h3 className="dropzone-title">
                  Drag and drop photos here
                </h3>
                <p className="dropzone-hint">
                  <span className="dropzone-link">or click to browse files</span>
                </p>
                <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginTop: '6px' }}>
                  Supports JPG, PNG, HEIC (Max 50MB per file)
                </span>
              </div>

              {filesToUpload.length > 0 && (
                <div className="upload-progress-card">
                  <div className="progress-header">
                    <span>
                      {isUploading ? 'Uploading photos...' : `${filesToUpload.length} photos selected`}
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>

                  <div className="progress-bar-bg">
                    <div className="progress-bar-track" style={{ width: `${uploadProgress}%` }} />
                  </div>

                  <div className="upload-file-list">
                    {uploadStatusList.map((item, idx) => (
                      <div key={idx} className="upload-file-item">
                        <div className="upload-file-info">
                          <img src={item.preview} alt="thumb" className="upload-file-thumb" />
                          <span style={{ fontWeight: 500, color: '#111111' }}>{item.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#6B7280', fontSize: '11px' }}>{item.size}</span>
                          {item.status === 'completed' ? (
                            <CheckCircle size={16} color="#166534" />
                          ) : item.status === 'failed' ? (
                            <AlertCircle size={16} color="#DC2626" />
                          ) : isUploading ? (
                            <RefreshCw size={14} className="spin" color="#C8A96B" />
                          ) : (
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D1D5DB' }} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setStep(1)}
                disabled={isUploading}
              >
                Back
              </button>
              <button 
                type="button" 
                className="btn-gold"
                onClick={handleStartUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : filesToUpload.length > 0 ? `Upload ${filesToUpload.length} Photos` : 'Continue to Share →'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: SHARE ALBUM
           ======================================================== */}
        {step === 3 && createdAlbum && (
          <div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '32px 24px 20px' }}>
              <div 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#EDF7EE',
                  color: '#1B7A38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '1px solid #D0E9D5'
                }}
              >
                <Check size={28} strokeWidth={2.5} />
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>
                Album Created Successfully!
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', maxWidth: '340px', margin: '0 auto 24px' }}>
                Your album is ready to share with your client. They can open this link on any mobile phone or browser to select photos.
              </p>

              {/* Link Input Row */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <input
                  type="text"
                  readOnly
                  className="form-input"
                  style={{ backgroundColor: '#F9FAFB', color: '#374151', fontSize: '12.5px' }}
                  value={`${window.location.origin}?token=${createdAlbum.clientToken}`}
                />
                <button 
                  className="btn-gold" 
                  onClick={handleCopyLink}
                  style={{ padding: '0 16px', flexShrink: 0, gap: '6px' }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* QR Code and WhatsApp options */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '20px', 
                padding: '16px', 
                backgroundColor: '#F5F5F7', 
                borderRadius: '12px',
                textAlign: 'left',
                border: '1px solid #E5E5E7'
              }}>
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="QR Code" 
                    style={{ width: '84px', height: '84px', borderRadius: '8px', backgroundColor: 'white', padding: '4px' }} 
                  />
                ) : (
                  <div style={{ width: '84px', height: '84px', backgroundColor: '#E5E5E7', borderRadius: '8px' }} />
                )}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#111111', marginBottom: '4px' }}>
                    Share this link with your client
                  </h4>
                  <p style={{ fontSize: '11.5px', color: '#6B7280', marginBottom: '8px' }}>
                    Clients can instantly view and pick photos on mobile without any app installation.
                  </p>
                  <button 
                    onClick={handleShareWhatsApp}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#128C7E',
                      backgroundColor: '#E7F7F4',
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}
                  >
                    <Share2 size={13} />
                    Send via WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => {
                  handleResetAndClose();
                  if (onOpenAlbum) onOpenAlbum(createdAlbum);
                }}
              >
                View Album
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleResetAndClose}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
