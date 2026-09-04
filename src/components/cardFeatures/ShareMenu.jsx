import React from 'react';
import { FaWhatsapp, FaFacebook } from "react-icons/fa";

const ShareMenu = ({ isOpen, onClose, shareUrl }) => {
  if (!isOpen) return null;

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
    onClose();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link: ', err);
      alert('Failed to copy link');
    }
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-10 ">
      <button className="flex items-center px-4 py-2 text-sm text-[var(--bg-purple)] hover:bg-[var(--bg-purple)] hover:text-white" onClick={handleWhatsAppShare}>
        <FaWhatsapp className="mr-2" /> WhatsApp
      </button>
      <button className="flex items-center px-4 py-2 text-sm text-[var(--bg-purple)] hover:bg-[var(--bg-purple)] hover:text-white" onClick={handleFacebookShare}>
        <FaFacebook className="mr-2" /> Facebook
      </button>
      <button className="flex items-center px-4 py-2 text-sm text-[var(--bg-purple)] hover:bg-[var(--bg-purple)] hover:text-white whitespace-nowrap" onClick={handleCopyLink}>
        <span className="mr-2">🔗</span> Copy Link
      </button>
    </div>
  );
};

export default ShareMenu;

