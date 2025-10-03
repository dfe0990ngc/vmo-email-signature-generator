import React, { useState, useRef } from 'react';
import { Upload, Copy, CheckCircle, Mail, Phone, Facebook } from 'lucide-react';
import VmoLogo from '../assets/OVM-Logo - Green - Approved.png';
import VmoLogoOrig from '../assets/OVM-Logo.png';
import SBLogo from '../assets/sb-logo.png';

export default function EmailSignatureGenerator() {
  const [imageBase64, setImageBase64] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const signatureRef = useRef(null);

  // Editable content
  const [name, setName] = useState('Legislative Department');
  const [location, setLocation] = useState('Santa Cruz, Davao del Sur');
  const [email, setEmail] = useState('vmosantacruz@gmail.com');
  const [phone, setPhone] = useState('+63 997 850 9514');
  const [facebook, setFacebook] = useState('fb.com/legislative.dept.stacruz.davsur');
  const [selectedColor, setSelectedColor] = useState('#387ff1');

  const colorOptions = [
    { value: '#387ff1', name: 'Blue' },
    { value: '#49dd83', name: 'Green' },
    { value: '#b9847c', name: 'Brown' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageBase64(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSignature = () => {
    if (imageBase64) {
      setIsGenerated(true);
    }
  };

  const copySignature = () => {
    if (!signatureRef.current) return;

    const signatureHTML = signatureRef.current.innerHTML;
    
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    tempDiv.innerHTML = signatureHTML;
    document.body.appendChild(tempDiv);

    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand('copy');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert('Failed to copy. Please select and copy manually from the preview.');
    }

    selection.removeAllRanges();
    document.body.removeChild(tempDiv);
  };

  const signatureHTML = imageBase64 ? (
    <div ref={signatureRef} style={{ background: 'transparent' }}>
      <table cellPadding="0" cellSpacing="0" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: '1.6', color: '#333', background: 'transparent' }}>
        <tbody>
          <tr>
            {/* Profile Image */}
            <td style={{ paddingRight: '20px', verticalAlign: 'top', background: 'transparent' }}>
              <img 
                src={imageBase64} 
                alt="Profile" 
                width="100"
                height="100"
                style={{ width: '100px', height: '100px', display: 'block', background: 'transparent' }}
              />
            </td>

            {/* User Info */}
            <td style={{ verticalAlign: 'top', background: 'transparent' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: selectedColor, marginBottom: '0px', background: 'transparent' }}>
                {name}
              </div>

              {location && (
                <div style={{ fontWeight:'bold', fontSize: '13px', color: '#666', marginBottom: '0px', background: 'transparent' }}>
                  {location}
                </div>
              )}

              <div style={{ height: '2px', background: selectedColor, width: '60px', marginBottom: '12px' }} />

              <div style={{ margin: '4px 0', background: 'transparent' }}>
                <span style={{ color: selectedColor }}>✉</span>{' '}
                <a href={`mailto:${email}`} style={{ color: '#555', textDecoration: 'none', background: 'transparent' }}>
                  {email}
                </a>
              </div>

              <div style={{ margin: '0px 0', background: 'transparent' }}>
                <span style={{ color: selectedColor }}>☎</span>{' '}
                <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: '#555', textDecoration: 'none', background: 'transparent' }}>
                  {phone}
                </a>
              </div>

              {facebook && (
                <div style={{ margin: '0px 0', background: 'transparent' }}>
                  <span style={{ color: selectedColor, fontSize:'16px' }}>🅕</span>{' '}
                  <a 
                    href={`https://${facebook.replace(/^https?:\/\//, '')}`} 
                    style={{ color: '#555', textDecoration: 'none', background: 'transparent', verticalAlign: 'middle' }} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {facebook}
                  </a>
                </div>
              )}
            </td>
            <td style={{ verticalAlign: 'top', background: 'transparent' }}>
              {/* <table width="100%" border={0}>
                <tr>
                  <td>
                    <img 
                      src={VmoLogo} 
                      alt="Logo" 
                      width="48"
                      height="48"
                      style={{ width: '48px', height: '48px', display: 'block', background: 'transparent' }}
                    />
                  </td>
                  <td>
                    <img 
                      src={SBLogo} 
                      alt="SB Logo" 
                      width="52"
                      height="56"
                      style={{ width: '52px', height: '56px', display: 'block', background: 'transparent' }}
                    />
                  </td>
                </tr>
              </table> */}
              <table align="center" border={0}>
                <tr>
                  <td>
                    <img 
                      src={VmoLogo} 
                      alt="Logo" 
                      width="32"
                      height="32"
                      style={{ width: '32px', height: '32px', display: 'block', background: 'transparent' }}
                    />
                  </td>
                  <td>
                    <img 
                      src={SBLogo} 
                      alt="SB Logo" 
                      width="36"
                      height="42"
                      style={{ width: '36px', height: '42px', display: 'block', background: 'transparent' }}
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Disclaimer */}
      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e0e0e0', fontSize: '11px', color: '#888', lineHeight: '1.5', maxWidth: '500px', background: 'transparent' }}>
        <strong>CONFIDENTIALITY NOTICE:</strong> This email and any attachments are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you are not the intended recipient, please notify the sender immediately and delete this email. Any unauthorized review, use, disclosure, or distribution is prohibited.
      </div>
    </div>

  ) : null;

  return (
    <div className="bg-gray-50 px-4 py-8 min-h-screen">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="relative bg-white shadow-md mb-6 p-8 rounded-lg">
          <h1 className="mb-2 font-bold text-3xl" style={{ color: selectedColor }}>📧 VMO - Email Signature Generator</h1>
          <p className="text-gray-600">Create a professional email signature for Gmail</p>

          <img src={VmoLogoOrig} alt="Logo" className="top-4 right-4 sm:right-8 absolute w-16 sm:w-24 h-16 sm:h-24" />
        </div>

        {/* Content Editor Section */}
        <div className="bg-white shadow-md mb-6 p-8 rounded-lg">
          <h2 className="mb-6 font-semibold text-gray-800 text-xl">✏️ Edit Signature Details</h2>
          
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Name / Department *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="Legislative Department"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Position/Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="Santa Cruz, Davao del Sur"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-4 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="+63 997 850 9514"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Facebook Page (Optional)
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="px-4 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="fb.com/yourpage"
              />
            </div>
          </div>

          {/* Color Selection */}
          <div className="mt-6">
            <label className="block mb-3 font-medium text-gray-700 text-sm">
              Brand Color
            </label>
            <div className="flex sm:flex-row flex-col gap-4">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-gray-800 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="rounded-full w-6 h-6"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="font-medium text-gray-700 text-sm">{color.name}</span>
                  {selectedColor === color.value && (
                    <CheckCircle className="w-4 h-4 text-gray-800" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow-md mb-6 p-8 rounded-lg">
          <div className="p-6 border-l-4 rounded" style={{ backgroundColor: `${selectedColor}10`, borderColor: selectedColor }}>
            <label className="block mb-3 font-semibold text-gray-700">
              <Upload className="inline-block mr-2 w-5 h-5" />
              Upload Your Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block hover:file:bg-blue-100 file:bg-blue-50 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded w-full file:font-semibold text-gray-500 file:text-blue-700 text-sm file:text-sm cursor-pointer"
            />
            <p className="mt-3 text-gray-600 text-sm">
              💡 Tip: Use a square image (e.g., 400x400px) for best results. The image will be embedded directly.
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={generateSignature}
              disabled={!imageBase64 || !name || !email || !phone}
              className="disabled:bg-gray-300 px-6 py-3 rounded-lg font-medium text-white transition-colors disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: imageBase64 && name && email && phone ? selectedColor : undefined,
              }}
            >
              Generate Signature
            </button>
            <button
              onClick={copySignature}
              disabled={!isGenerated}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 px-6 py-3 rounded-lg font-medium text-white transition-colors disabled:cursor-not-allowed"
            >
              {copySuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Signature HTML
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        {isGenerated && (
          <div className="bg-white shadow-md mb-6 p-8 rounded-lg overflow-x-auto">
            <h2 className="mb-4 font-semibold text-gray-800 text-xl">Preview:</h2>
            <div className="bg-transparent p-6 border-2 border-gray-300 border-dashed rounded-lg min-w-[500px]">
              {signatureHTML}
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              👆 Select and copy manually if the copy button doesn't work
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-amber-50 shadow-md p-8 border-amber-500 border-l-4 rounded-lg">
          <h2 className="mb-4 font-bold text-gray-800 text-xl">📋 How to Use Your Signature:</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-700">Step 1: Enter Your Details</h3>
              <ul className="space-y-1 ml-4 text-gray-600 list-disc list-inside">
                <li>Fill in your name, email, phone, and other details</li>
                <li>Upload your profile photo (recommended size: <strong>400px × 400px</strong>)</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-gray-700">Step 2: Generate Your Signature</h3>
              <ul className="space-y-1 ml-4 text-gray-600 list-disc list-inside">
                <li>Click the <strong>"Generate Signature"</strong> button</li>
                <li>Preview your signature with your details and photo</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-gray-700">Step 3: Copy and Paste</h3>
              <ul className="space-y-1 ml-4 text-gray-600 list-disc list-inside">
                <li>Click <strong>"Copy Signature"</strong></li>
                <li>Go to Gmail and compose a new email</li>
                <li>Paste the signature <strong>directly below your email body</strong></li>
              </ul>
            </div>

            <div className="bg-white mt-4 p-4 border border-amber-200 rounded">
              <h3 className="mb-2 font-semibold text-gray-700">ℹ️ Important Notes:</h3>
              <ul className="space-y-1 ml-4 text-gray-600 list-disc list-inside">
                <li><strong>Do not use Gmail Settings signature editor</strong> – the look may change due to Gmail’s formatting.</li>
                <li>Always paste the signature <strong>manually</strong> when sending emails.</li>
                <li>If you’ve already used it before, you can also copy the signature from your <strong>previously sent emails</strong> instead of regenerating.</li>
                <li>For best results, keep your photo <strong>square (400×400px)</strong> so it looks clean in Gmail.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}