import React, { useState, useRef } from 'react';
import { Upload, Copy, CheckCircle, Image as ImageIcon } from 'lucide-react';
import VmoLogoOrig from '../assets/OVM-Logo.png';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function EmailSignatureGenerator() {
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const signatureRef = useRef(null);

  // Editable content
  const [name, setName] = useState('Legislative Department');
  const [location, setLocation] = useState('Santa Cruz, Davao del Sur');
  const [email, setEmail] = useState('vmosantacruz@gmail.com');
  const [phone, setPhone] = useState('+63 997 850 9514');
  const [facebook, setFacebook] = useState('fb.com/legislative.dept.stacruz.davsur');
  const [selectedColor, setSelectedColor] = useState('#387ff1');
  const [disclaimer, setDisclaimer] = useState('CONFIDENTIALITY NOTICE: This email and any attachments are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you are not the intended recipient, please notify the sender immediately and delete this email. Any unauthorized review, use, disclosure, or distribution is prohibited.');

  const colorOptions = [
    { value: '#387ff1', name: 'Blue' },
    { value: '#49dd83', name: 'Green' },
    { value: '#b9847c', name: 'Brown' }
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadLoading(true);
      setUploadError(null);

      try {
        const cloudinaryUrl = await uploadToCloudinary(file);
        setCloudinaryUrl(cloudinaryUrl);
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        setUploadError(error.message);
      } finally {
        setUploadLoading(false);
      }
    }
  };

  const generateSignature = () => {
    if (cloudinaryUrl) {
      setIsGenerated(true);
    }
  };

  const copySignature = () => {
    if (!signatureRef.current) return;

    const signatureHTML = signatureRef.current.innerHTML;

    const tempDiv = document.createElement('div');
    // defensive wrapper: inline styles here too, so paste into Gmail keeps structure
    tempDiv.setAttribute('style',
      'position:fixed;left:-9999px;top:0;width:600px;overflow:hidden;'
    );
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

  // ----------------------------
  // Gmail-friendly signature HTML
  // - table-first layout (most robust in Gmail)
  // - absolutely positioned blocks inside a relatively-positioned cell for precise layout
  // - every important attribute inline (fonts, font-size, line-height, color, display)
  // - simplified structure for easier copying
  // ----------------------------
  const signatureHTML = cloudinaryUrl ? (
    <div ref={signatureRef}>
      <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#333333', lineHeight: '1.2', fontSize: '14px', display: 'block' }}>
        {/* Outer table wrapper */}
        <table cellPadding="0" cellSpacing="0" border="0" width="600" style={{ maxWidth: '600px', width: '100%', borderCollapse: 'collapse', msoTableLspace: 0, msoTableRspace: 0 }}>
          <tbody>
            <tr>
              <td style={{ padding: 0 }}>
                {/* Use an inner table with fixed height to allow absolute positioning inside the left cell */
                /* We keep markup minimal: left cell for image, right cell for content. */}
                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      {/* left column: relatively positioned container so child blocks can be absolutely placed */}
                      <td width="140" valign="top" style={{ padding: '8px 12px 8px 0', verticalAlign: 'top', position: 'relative' }}>
                        <div style={{ position: 'relative', width: '130px', height: '130px', display: 'block' }}>
                          {/* Profile image: absolutely positioned so it stays fixed inside left column */}
                          <img
                            src={cloudinaryUrl}
                            alt="Profile"
                            width="130"
                            height="130"
                            style={{
                              display: 'block',
                              width: '130px',
                              height: '130px',
                              lineHeight: '1',
                              border: '0',
                              outline: 'none',
                              textDecoration: 'none',
                              objectFit: 'cover',
                              borderRadius: '0'
                            }}
                          />
                        </div>
                      </td>

                      {/* right column: main text block */}
                      <td valign="top" style={{ padding: '12px 0 8px 6px', verticalAlign: 'top' }}>
                        <div style={{ display: 'block', marginBottom: '6px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '1.15', color: selectedColor || '#387ff1', fontFamily: 'Arial, Helvetica, sans-serif', display: 'inline-block' }}>
                            {name}
                          </span>
                        </div>

                        {location && (
                          <div style={{ fontSize: '12px', color: '#666666', fontWeight: 600, marginBottom: '8px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                            {location}
                          </div>
                        )}

                        {/* simple divider — using an inline image to avoid Gmail stripping */}
                        <div style={{ margin: '6px 0 10px 0' }}>
                          <img
                            src="https://res.cloudinary.com/duybphdbl/image/upload/v1760533782/blue-line_rgob95.png"
                            width="120"
                            height="3"
                            alt=""
                            style={{ display: 'block', border: '0', height: '3px', width: '120px', maxWidth: '100%' }}
                          />
                        </div>

                        {/* Contacts: table for vertical alignment and stable rendering */}
                        <table cellPadding="0" cellSpacing="0" border="0" style={{ borderCollapse: 'collapse', width: '100%' }}>
                          <tbody>
                            <tr>
                              <td style={{ verticalAlign: 'middle', padding: '3px 0' }}>
                                <img
                                  src="https://res.cloudinary.com/duybphdbl/image/upload/v1759619667/email-blue_rk0zdk.png"
                                  alt="Email"
                                  width="14"
                                  height="14"
                                  style={{ display: 'inline-block', verticalAlign: 'middle', border: '0', marginRight: '8px' }}
                                />
                                <a href={`mailto:${email}`} style={{ color: '#555555', textDecoration: 'none', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'middle' }}>
                                  &nbsp;{email}
                                </a>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ verticalAlign: 'middle', padding: '3px 0' }}>
                                <img
                                  src="https://res.cloudinary.com/duybphdbl/image/upload/v1759619668/phone-blue_qpok67.png"
                                  alt="Phone"
                                  width="14"
                                  height="14"
                                  style={{ display: 'inline-block', verticalAlign: 'middle', border: '0', marginRight: '8px' }}
                                />
                                <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: '#555555', textDecoration: 'none', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'middle' }}>
                                  &nbsp;{phone}
                                </a>
                              </td>
                            </tr>

                            {facebook && (
                              <tr>
                                <td style={{ verticalAlign: 'middle', padding: '3px 0' }}>
                                  <img
                                    src="https://res.cloudinary.com/duybphdbl/image/upload/v1759619668/facebook-blue_ijfdsg.png"
                                    alt="Facebook"
                                    width="14"
                                    height="14"
                                    style={{ display: 'inline-block', verticalAlign: 'middle', border: '0', marginRight: '8px' }}
                                  />
                                  <a
                                    href={`https://${facebook.replace(/^https?:\/\//, '')}`}
                                    style={{ color: '#555555', textDecoration: 'none', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'middle' }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    &nbsp;{facebook}
                                  </a>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Disclaimer row */}
                    <tr>
                      <td colSpan="2" style={{ paddingTop: '12px', paddingBottom: '6px' }}>
                        <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: '8px 0 0 0' }}>
                                <img
                                  src="https://res.cloudinary.com/duybphdbl/image/upload/v1759618075/fb-cover-WITH-SB-LOGO-Left-Right-wrapped_sqkpxb.png"
                                  alt="VMO Logo"
                                  width="500"
                                  style={{ display: 'block', maxWidth: '100%', height: 'auto', border: '0' }}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ paddingTop: '8px' }}>
                                <div style={{ fontSize: '11px', color: '#888888', lineHeight: '1.25', fontFamily: 'Arial, Helvetica, sans-serif', maxWidth: '500px' }}>
                                  {disclaimer}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ) : null;

  return (
    <div className="px-2 sm:px-4 py-4 sm:py-8 min-h-screen">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="relative bg-white shadow-md mb-4 sm:mb-6 p-4 sm:p-8 rounded-lg">
          <div className="pr-16 sm:pr-24">
            <h1 className="mb-2 font-bold text-xl sm:text-2xl lg:text-3xl leading-tight" style={{ color: selectedColor }}>📧 VMO - Email Signature Generator</h1>
            <p className="text-gray-600 text-sm sm:text-base">Create a professional email signature for Gmail</p>
          </div>
          <img src={VmoLogoOrig} alt="Logo" className="top-3 sm:top-4 right-3 sm:right-4 lg:right-8 absolute w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24" />
        </div>

        {/* Content Editor Section */}
        <div className="bg-white shadow-md mb-4 sm:mb-6 p-4 sm:p-8 rounded-lg">
          <h2 className="mb-4 sm:mb-6 font-semibold text-gray-800 text-lg sm:text-xl">✏️ Edit Signature Details</h2>

          <div className="gap-4 sm:gap-6 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Name / Department *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:text-sm text-base"
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
                className="px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:text-sm text-base"
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
                className="px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:text-sm text-base"
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
                className="px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:text-sm text-base"
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
                className="px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:text-sm text-base"
                placeholder="fb.com/yourpage"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Disclaimer Text
              </label>
              <textarea
                value={disclaimer}
                onChange={(e) => setDisclaimer(e.target.value)}
                rows={4}
                className="px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:text-sm text-base leading-relaxed resize-vertical"
                placeholder="Enter your confidentiality notice or disclaimer text..."
              />
              <p className="mt-1 text-gray-500 text-xs">
                This text will appear in the disclaimer section of your email signature.
              </p>
            </div>
          </div>

          {/* Color Selection */}
          <div className="mt-4 sm:mt-6">
            <label className="block mb-3 font-medium text-gray-700 text-sm">
              Brand Color
            </label>
            <div className="flex sm:flex-row flex-col gap-3 sm:gap-4">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`flex items-center gap-2 px-4 py-3 sm:py-2 rounded-lg border-2 transition-all touch-manipulation ${
                    selectedColor === color.value
                      ? 'border-gray-800 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'
                  }`}
                >
                  <div
                    className="flex-shrink-0 rounded-full w-6 h-6"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="font-medium text-gray-700 text-sm">{color.name}</span>
                  {selectedColor === color.value && (
                    <CheckCircle className="flex-shrink-0 w-4 h-4 text-gray-800" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow-md mb-4 sm:mb-6 p-4 sm:p-8 rounded-lg">
          <div className="p-4 sm:p-6 border-l-4 rounded" style={{ backgroundColor: `${selectedColor}10`, borderColor: selectedColor }}>
            <label className="block mb-3 font-semibold text-gray-700 text-sm sm:text-base">
              <Upload className="inline-block mr-2 w-5 h-5" />
              Upload Your Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block hover:file:bg-blue-100 file:bg-blue-50 sm:file:mr-4 file:mr-3 sm:file:px-4 file:px-3 file:py-2 file:border-0 file:rounded w-full file:font-semibold text-gray-500 file:text-blue-700 text-sm file:text-sm touch-manipulation cursor-pointer"
            />
            <p className="mt-3 text-gray-600 text-sm">
              💡 Tip: The image will be automatically optimized to 400px width for best performance. Use a square image for best results.
            </p>

            {/* Upload Status */}
            {uploadLoading && (
              <div className="bg-blue-50 mt-3 p-3 border border-blue-200 rounded-lg">
                <p className="flex items-center text-blue-700 text-sm">
                  <svg className="mr-3 -ml-1 w-5 h-5 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Optimizing image...
                </p>
              </div>
            )}

            {uploadError && (
              <div className="bg-red-50 mt-3 p-3 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  ❌ Upload failed: {uploadError}
                </p>
              </div>
            )}

            {cloudinaryUrl && !uploadLoading && (
              <div className="bg-green-50 mt-3 p-3 border border-green-200 rounded-lg">
                <p className="flex items-center text-green-700 text-sm">
                  <CheckCircle className="mr-2 w-4 h-4" />
                  Image optimized successfully!
                </p>
                {/* Preview thumbnail */}
                <div className="mt-2">
                  <img
                    src={cloudinaryUrl}
                    alt="Upload preview"
                    className="border rounded w-20 h-20 object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex sm:flex-row flex-col gap-3 sm:gap-3 mt-4 sm:mt-6">
            <button
              onClick={generateSignature}
              disabled={!cloudinaryUrl || !name || !email || !phone || uploadLoading}
              className="order-1 disabled:bg-gray-300 px-6 py-4 sm:py-3 rounded-lg w-full sm:w-auto font-medium text-white sm:text-sm text-base transition-colors touch-manipulation disabled:cursor-not-allowed"
              style={{
                backgroundColor: cloudinaryUrl && name && email && phone && !uploadLoading ? selectedColor : undefined,
              }}
            >
              {uploadLoading ? 'Uploading...' : 'Generate Signature'}
            </button>
            <button
              onClick={copySignature}
              disabled={!isGenerated}
              className="flex justify-center items-center gap-2 order-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 px-6 py-4 sm:py-3 rounded-lg w-full sm:w-auto font-medium text-white sm:text-sm text-base transition-colors touch-manipulation disabled:cursor-not-allowed"
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
          <div className="bg-white shadow-md mb-4 sm:mb-6 p-4 sm:p-8 rounded-lg">
            <h2 className="mb-4 font-semibold text-gray-800 text-lg sm:text-xl">Preview:</h2>
            <div className="bg-transparent p-3 sm:p-6 border-2 border-gray-300 border-dashed rounded-lg overflow-x-auto">
              <div className="min-w-[500px]">
                {signatureHTML}
              </div>
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              👆 Select and copy manually if the copy button doesn't work
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-amber-50 shadow-md p-4 sm:p-8 border-amber-500 border-l-4 rounded-lg">
          <h2 className="mb-4 font-bold text-gray-800 text-lg sm:text-xl">📋 How to Use Your Signature:</h2>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-700 text-base sm:text-lg">Step 1: Enter Your Details</h3>
              <ul className="space-y-1 ml-4 text-gray-600 text-sm sm:text-base list-disc list-inside">
                <li>Fill in your name, email, phone, and other details</li>
                <li>Customize your disclaimer text if needed</li>
                <li>Upload your profile photo (automatically optimized to <strong>400px width</strong>)</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-gray-700 text-base sm:text-lg">Step 2: Generate Your Signature</h3>
              <ul className="space-y-1 ml-4 text-gray-600 text-sm sm:text-base list-disc list-inside">
                <li>Click the <strong>"Generate Signature"</strong> button</li>
                <li>Preview your signature with your details and photo</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-gray-700 text-base sm:text-lg">Step 3: Add to Gmail</h3>
              <ul className="space-y-1 ml-4 text-gray-600 text-sm sm:text-base list-disc list-inside">
                <li>Click <strong>"Copy Signature"</strong></li>
                <li>Go to Gmail Settings (⚙️) → <strong>"See all settings"</strong> → <strong>"General"</strong></li>
                <li>Scroll down to the <strong>"Signature"</strong> section</li>
                <li>Create a new signature or edit existing one</li>
                <li>Paste the signature into the signature editor</li>
                <li>Click <strong>"Save Changes"</strong> at the bottom</li>
              </ul>
            </div>

            <div className="bg-white mt-4 p-3 sm:p-4 border border-amber-200 rounded">
              <h3 className="mb-2 font-semibold text-gray-700 text-base sm:text-lg">✅ Gmail Compatible Features:</h3>
              <ul className="space-y-1 ml-4 text-gray-600 text-sm sm:text-base list-disc list-inside">
                <li><strong>Now compatible with Gmail's signature editor!</strong> The styling is preserved when pasted.</li>
                <li><strong>Responsive to Gmail's text size controls</strong> - Works with Small, Normal, Large, and Huge settings</li>
                <li>Simplified HTML structure that works well with Gmail's formatting system</li>
                <li>Properly formatted contact information with clickable links</li>
                <li>Images are automatically optimized for faster loading</li>
                <li>Alternative: You can still paste manually in emails if preferred</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
