import { useEffect, useRef } from 'react';
import type { CertificationEntry } from '@/types/content';
import { getAssetPath } from '@/utils/assets';
import styles from './CertificateViewerModal.module.css';

interface CertificateViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificationEntry | null;
}

export function CertificateViewerModal({
  isOpen,
  onClose,
  certificate,
}: CertificateViewerModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !certificate) {
    return null;
  }

  const isPdf = certificate.image ? certificate.image.toLowerCase().endsWith('.pdf') : false;
  const assetUrl = certificate.image ? getAssetPath(certificate.image) : '';

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-viewer-title"
    >
      <div ref={modalRef} className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <span className={styles.modalIssuer}>{certificate.issuer}</span>
            <h3 id="cert-viewer-title" className={styles.modalTitle}>
              {certificate.title}
            </h3>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close certificate viewer"
          >
            ✕
          </button>
        </div>

        {/* Viewer Body */}
        <div className={styles.viewerBody}>
          {isPdf ? (
            <iframe
              src={assetUrl}
              title={certificate.title}
              className={styles.pdfFrame}
            />
          ) : assetUrl ? (
            <img
              src={assetUrl}
              alt={`${certificate.title} Certificate`}
              className={styles.certificateImage}
            />
          ) : (
            <div style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Certificate preview asset unavailable
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.modalMeta}>
            <span>Issued: {certificate.issueDate}</span>
            {certificate.hours && (
              <>
                <span aria-hidden="true">·</span>
                <span>{certificate.hours} Hours Training</span>
              </>
            )}
            {certificate.validity && (
              <>
                <span aria-hidden="true">·</span>
                <span>Validity: {certificate.validity}</span>
              </>
            )}
            {certificate.verificationId && (
              <>
                <span aria-hidden="true">·</span>
                <span>ID: {certificate.verificationId}</span>
              </>
            )}
          </div>

          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLink}
            >
              <span>Verify on Credential Portal</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default CertificateViewerModal;
