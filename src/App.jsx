import { useState } from 'react';

export default function App() {
  const [apiKey, setApiKey] = useState('');

  // MODE DESAIN: 'Banner' atau 'Vector Portrait'
  const [designCategory, setDesignCategory] = useState('Banner');

  // 1. DATA INFORMASI (TEKS)
  const [mainTitle, setMainTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slogan, setSlogan] = useState('');

  // 2. PANEL KONTAK & ALAMAT (Khusus Banner)
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [address, setAddress] = useState('');

  // 3. BAHAN VISUAL & GAYA (Khusus Vector Portrait Single)
  const [backgroundStyle, setBackgroundStyle] = useState('Solid Pastel Pink Background');
  const [artStyle, setArtStyle] = useState('Flat Vector Art Illustration, Adobe Illustrator Style');
  const [productList, setProductList] = useState('');
  const [supportingElements, setSupportingElements] = useState('');

  // 4. SPESIFIKASI & DUAL GAMBAR (Target & Style Reference)
  const [orientation, setOrientation] = useState('Portrait');
  const [bannerSize, setBannerSize] = useState('High Resolution Digital Art');
  const [colorPalette, setColorPalette] = useState('');
  const [themeStyle, setThemeStyle] = useState('Clean Vector Portrait');

  // State untuk 2 Gambar Berbeda
  const [targetBase64, setTargetBase64] = useState(null);
  const [targetPreview, setTargetPreview] = useState(null);

  const [styleBase64, setStyleBase64] = useState(null);
  const [stylePreview, setStylePreview] = useState(null);

  // 5. PERINTAH KHUSUS
  const [specialNotes, setSpecialNotes] = useState('Ubah wajah dari Foto Target persis ke dalam gaya ilustrasi Vektor');
  
  // OUTPUT & LOADING
  const [outputResult, setOutputResult] = useState('Hasil JSON prompt akan muncul di sini...');
  const [isLoading, setIsLoading] = useState(false);

  // Handler Upload Foto Target (Wajah Asli)
  const handleTargetFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setTargetBase64(e.target.result.split(',')[1]);
      setTargetPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handler Upload Referensi Gaya
  const handleStyleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setStyleBase64(e.target.result.split(',')[1]);
      setStylePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Global Paste Handler untuk Target Image
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        handleTargetFile(item.getAsFile());
        break;
      }
    }
  };

  const removeTargetImage = (e) => {
    e.stopPropagation();
    setTargetBase64(null);
    setTargetPreview(null);
  };

  const removeStyleImage = (e) => {
    e.stopPropagation();
    setStyleBase64(null);
    setStylePreview(null);
  };

  const generatePrompt = async () => {
    if (!apiKey.trim()) {
      alert('Masukkan Gemini API Key terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    setOutputResult('');

    const isVectorPortrait = designCategory === 'Vector Portrait';

    const systemInstruction = isVectorPortrait ? `
You are an expert Image-to-Prompt Converter and Senior Vector Illustrator. 
Your task is to analyze the uploaded images and output a precise, professional English JSON prompt for an AI image generator (like Midjourney / Stable Diffusion / Imagen).

CRITICAL IMAGE MAPPING RULES:
1. IMAGE 1 (THE TARGET SUBJECT): This is the absolute source of truth for the human face, facial bone structure, eyes, nose, lips, expression, and unique features. You MUST instruct the generator to preserve this exact person's face.
2. IMAGE 2 (THE STYLE REFERENCE): Use this ONLY for the vector art style, line art thickness, shading style, and color grading aesthetic. Do NOT use the face from Image 2.

[USER INPUT DATA]
- Background Style: ${backgroundStyle}
- Art Style: ${artStyle}
- Character Details & Outfit: ${description}
- Orientation: ${orientation}
- Dominant Colors: ${colorPalette}
- Theme Style: ${themeStyle}
- Special Notes: ${specialNotes}

Generate the output ONLY as a structured JSON object with no opening or closing conversational text. Use the following JSON schema:
{
  "task": "Transform the user's uploaded real selfie photo into a high-end vector portrait illustration",
  "subject_description": "An Indonesian adult woman with a round facial structure, warm brown skin tone, expressive dark brown eyes, a well-defined nose, full lips with natural pink lipstick, wearing a dark black hijab covering her hair and neck tightly, gentle and calm facial expression, angled selfie perspective.",
  "art_style_transfer": "Apply a clean flat vector art illustration style, Adobe Illustrator aesthetic, smooth vector gradient skin shading, clean sharp outlines, and stylized minimalist eye highlights.",
  "composition": "Single centered subject portrait, looking slightly upwards toward the camera, clean vector format, no extra people, no grids, no collage, no text.",
  "background": "Solid Pastel Pink Background",
  "orientation": "Portrait",
  "rendering_quality": "8K Ultra-HD, razor-sharp vector graphic, clean vector outlines, smooth shading, print-ready 300 DPI",
  "negative_prompt": "baby, child, second person, multiple subjects, grid, collage, text, watermark, photo realism, 3D render, rough lines, noisy textures"
}
    ` : `
You are a Senior Graphic Designer & Professional AI Prompt Engineer specializing in Banners & Billboards.
Analyze the attached reference image (if any) and combine it with the following user inputs.

CRITICAL RULE FOR LANGUAGE:
- Write ALL structural instructions, visual styles, design themes, layout instructions, and negative prompts in **Professional English** to ensure maximum AI rendering accuracy.
- Keep the specific text contents provided by the user in their original language.

[USER INPUT DATA]
- Design Mode: Commercial Banner
- Main Title: ${mainTitle}
- Sub-Title: ${subTitle}
- Description/Details: ${description}
- Slogan: ${slogan}
- WhatsApp: ${whatsapp} | Instagram: ${instagram} | TikTok: ${tiktok}
- Address/Date: ${address}
- Product List: ${productList}
- Supporting Elements: ${supportingElements}
- Orientation: ${orientation}
- Banner Size: ${bannerSize}
- Dominant Colors: ${colorPalette}
- Theme Style: ${themeStyle}
- Special Notes: ${specialNotes}

[ANTI-AI LOOK & PROFESSIONAL GRAPHIC DESIGN STANDARDS]
1. ANTI-AI LOOK: Avoid exaggerated 3D renders, unnatural glossy/airbrushed digital effects, neon lighting, weird human skin textures, or absurd unnecessary decorations.
2. FLAT & CLEAN GRAPHIC VECTOR: The design must look like it was purely crafted using vector software. Use sharp lines, clean grid alignment, and clear typography hierarchy.
3. HD & ULTRA SHARP: Visual quality must be "8K resolution print-ready graphic design, crisp edges, razor-sharp typography, vector perfection".

Generate the output ONLY as a structured JSON object with no opening or closing conversational text. Use the following JSON schema:
{
  "design_type": "Banner / Spanduk ${orientation}",
  "size": "${bannerSize}",
  "orientation": "${orientation}",
  "rendering_quality": "8K Ultra-HD, razor-sharp vector graphic, print-ready 300 DPI",
  "anti_ai_visual_style": "Clean flat vector graphic design, Adobe Illustrator style, sharp clean lines",
  "design_theme": "${themeStyle}",
  "color_scheme": "${colorPalette}",
  "typography_hierarchy": {
    "main_title": "${mainTitle}",
    "sub_title": "${subTitle}",
    "detail_text": "${description}",
    "slogan_footer": "${slogan}"
  },
  "contacts_and_info": {
    "whatsapp": "${whatsapp}",
    "instagram": "${instagram}",
    "tiktok": "${tiktok}",
    "address_date": "${address}"
  },
  "visual_elements_and_logos": [
    "${supportingElements}"
  ],
  "precise_layout_instruction": "Professional symmetrical placement, balanced arrangement based on reference layout.",
  "negative_prompt": "3D render, glossy, plastic look, blurry text, distorted fonts, airbrushed, noise"
}
    `;

    // Susun isi konten dengan mengirimkan kedua gambar jika ada di mode Vector Portrait
    const contentsParts = [{ text: systemInstruction }];
    if (isVectorPortrait) {
      if (targetBase64) {
        contentsParts.push({
          inline_data: { mime_type: 'image/png', data: targetBase64 },
        });
      }
      if (styleBase64) {
        contentsParts.push({
          inline_data: { mime_type: 'image/png', data: styleBase64 },
        });
      }
    } else {
      if (targetBase64) {
        contentsParts.push({
          inline_data: { mime_type: 'image/png', data: targetBase64 },
        });
      }
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: contentsParts }] }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setOutputResult(data.candidates[0].content.parts[0].text);
      } else {
        setOutputResult('Gagal menghasilkan prompt:\n' + JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setIsLoading(false);
      setOutputResult('Error: ' + err.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputResult);
    alert('English JSON Prompt berhasil disalin!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8" onPaste={handlePaste}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Mode Switcher */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-blue-400">Prompt Studio Multi-Engine v2.1</h1>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] rounded-full font-semibold">
                🌐 Dual-Image Source Active
              </span>
            </div>
            <p className="text-xs text-slate-400">Pembangun Structured Prompt dengan Pemisahan Foto Target & Style Reference</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="password"
              placeholder="Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full md:w-48 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs outline-none focus:border-blue-500"
            />
          </div>
        </header>

        {/* Mode Switcher Tabs */}
        <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/60 flex gap-2">
          <button
            onClick={() => setDesignCategory('Banner')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition ${
              designCategory === 'Banner'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🖼️ Mode Banner / Spanduk Komersial
          </button>
          <button
            onClick={() => setDesignCategory('Vector Portrait')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition ${
              designCategory === 'Vector Portrait'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🎨 Mode Single Vector Portrait (Dual Image Input)
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Form Kiri */}
          <div className="space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800 text-xs">
            
            {/* 1. DATA INFORMASI / KARAKTER */}
            <div className="space-y-2">
              <h2 className="font-bold text-blue-400 uppercase tracking-wider">
                {designCategory === 'Banner' ? '1. Data Informasi (Teks Spanduk)' : '1. Deskripsi Karakter & Subjek'}
              </h2>
              {designCategory === 'Banner' && (
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Judul Utama" value={mainTitle} onChange={(e) => setMainTitle(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                  <input type="text" placeholder="Sub-Judul" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                </div>
              )}
              <input 
                type="text" 
                placeholder={designCategory === 'Banner' ? "Informasi / Detail Penawaran" : "Deskripsi Karakter Tambahan (e.g. Wanita berhijab hitam, senyum ramah)"} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" 
              />
              {designCategory === 'Banner' && (
                <input type="text" placeholder="Slogan / Instansi" value={slogan} onChange={(e) => setSlogan(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
              )}
            </div>

            {/* 2. PANEL KONTAK ATAU LATAR BELAKANG */}
            {designCategory === 'Banner' ? (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h2 className="font-bold text-blue-400 uppercase tracking-wider">2. Panel Kontak & Alamat</h2>
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" placeholder="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                  <input type="text" placeholder="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                  <input type="text" placeholder="TikTok" value={tiktok} onChange={(e) => setTikTok(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                </div>
                <input type="text" placeholder="Alamat / Tanggal" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h2 className="font-bold text-indigo-400 uppercase tracking-wider">2. Gaya Latar Belakang & Seni Vektor</h2>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Gaya Latar (e.g. Solid Pastel Pink Background)" 
                    value={backgroundStyle} 
                    onChange={(e) => setBackgroundStyle(e.target.value)} 
                    className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" 
                  />
                  <input 
                    type="text" 
                    placeholder="Gaya Seni (e.g. Flat Vector Art)" 
                    value={artStyle} 
                    onChange={(e) => setArtStyle(e.target.value)} 
                    className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" 
                  />
                </div>
              </div>
            )}

            {/* 3. BAHAN VISUAL */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h2 className="font-bold text-blue-400 uppercase tracking-wider">3. Bahan Visual & Elemen Pendukung</h2>
              {designCategory === 'Banner' && (
                <input type="text" placeholder="Daftar Produk" value={productList} onChange={(e) => setProductList(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
              )}
              <input type="text" placeholder="Elemen Tambahan (e.g. Pencahayaan lembut, tanpa teks)" value={supportingElements} onChange={(e) => setSupportingElements(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
            </div>

            {/* 4. SPESIFIKASI & DUAL UPLOAD GAMBAR */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h2 className="font-bold text-blue-400 uppercase tracking-wider">4. Spesifikasi & Sumber Gambar</h2>
              <div className="grid grid-cols-2 gap-2">
                <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none">
                  <option value="Portrait">Portrait</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Square">Square</option>
                </select>
                <input type="text" placeholder="Ukuran / Resolusi" value={bannerSize} onChange={(e) => setBannerSize(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Warna Dominan (e.g. Pink, Grey)" value={colorPalette} onChange={(e) => setColorPalette(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                <input type="text" placeholder="Tema Desain" value={themeStyle} onChange={(e) => setThemeStyle(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
              </div>

              {/* Wadah Dual Upload Gambar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                
                {/* 1. Upload Foto Target (Yang Mau Diubah) */}
                <div className="border border-dashed border-blue-500/50 rounded-lg p-3 text-center bg-blue-950/20 relative">
                  <p className="font-semibold text-blue-400 mb-1">1. Foto Target (Asli)</p>
                  {!targetPreview ? (
                    <>
                      <input type="file" accept="image/*" onChange={(e) => handleTargetFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <p className="text-slate-400 py-4 text-[11px]">Klik / Paste foto yang ingin diubah ke sini</p>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <img src={targetPreview} alt="Target Preview" className="max-h-28 mx-auto rounded border border-slate-700 object-contain" />
                      <button onClick={removeTargetImage} type="button" className="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded text-[10px]">
                        🗑️ Hapus Target
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Upload Referensi Gaya (Style Art) */}
                {designCategory === 'Vector Portrait' && (
                  <div className="border border-dashed border-indigo-500/50 rounded-lg p-3 text-center bg-indigo-950/20 relative">
                    <p className="font-semibold text-indigo-400 mb-1">2. Referensi Gaya Seni</p>
                    {!stylePreview ? (
                      <>
                        <input type="file" accept="image/*" onChange={(e) => handleStyleFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <p className="text-slate-400 py-4 text-[11px]">Klik / Upload contoh gaya vektor (opsional)</p>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <img src={stylePreview} alt="Style Preview" className="max-h-28 mx-auto rounded border border-slate-700 object-contain" />
                        <button onClick={removeStyleImage} type="button" className="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded text-[10px]">
                          🗑️ Hapus Style Ref
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* 5. PERINTAH KHUSUS */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h2 className="font-bold text-blue-400 uppercase tracking-wider">5. Perintah Khusus</h2>
              <textarea rows="2" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="E.g. Ubah wajah dari Foto Target ke gaya vektor" className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none"></textarea>
            </div>

            <button onClick={generatePrompt} className={`w-full py-2.5 font-bold text-white rounded transition shadow-lg ${designCategory === 'Banner' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'}`}>
              Generate {designCategory === 'Banner' ? 'Banner' : 'Single Vector Portrait'} JSON Prompt →
            </button>
          </div>

          {/* Result Kanan */}
          <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h2 className="font-bold text-indigo-400 text-sm">PROMPT OUTPUT (ENGLISH JSON)</h2>
                <button onClick={copyToClipboard} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded">
                  📋 Copy Prompt
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-20 text-xs text-slate-400 space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                  <p>Gemini sedang menyusun Dual-Source Vector Prompt...</p>
                </div>
              ) : (
                <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-[600px] whitespace-pre-wrap">
                  {outputResult}
                </pre>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
