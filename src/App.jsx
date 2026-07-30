import { useState } from 'react';

export default function App() {
  const [apiKey, setApiKey] = useState('AQ.Ab8RN6IZbY2EJE5sxROEIzsVzVXuPtpSUgMsWFBBoPrH2_1yyQ');

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

  // 3. BAHAN VISUAL & GRID (Khusus Vector Portrait)
  const [gridType, setGridType] = useState('2x2 Grid Collage (Empat Panel)');
  const [frameStyle, setFrameStyle] = useState('Clean White Border with Color Frame');
  const [productList, setProductList] = useState('');
  const [supportingElements, setSupportingElements] = useState('');

  // 4. SPESIFIKASI & REFERENSI
  const [orientation, setOrientation] = useState('Portrait');
  const [bannerSize, setBannerSize] = useState('A4 / Custom Grid');
  const [colorPalette, setColorPalette] = useState('');
  const [themeStyle, setThemeStyle] = useState('Flat Vector Illustration');

  // 5. PERINTAH KHUSUS & GAMBAR
  const [specialNotes, setSpecialNotes] = useState('Ambil data dan referensi visual dengan akurat');
  const [base64Image, setBase64Image] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // OUTPUT & LOADING
  const [outputResult, setOutputResult] = useState('Hasil JSON prompt akan muncul di sini...');
  const [isLoading, setIsLoading] = useState(false);

  // Handle Upload & Paste Gambar
  const handleFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setBase64Image(e.target.result.split(',')[1]);
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        handleFileChange(item.getAsFile());
        break;
      }
    }
  };

  // Fungsi untuk Menghapus Gambar
  const removeImage = (e) => {
    e.stopPropagation();
    setBase64Image(null);
    setImagePreview(null);
  };

  const generatePrompt = async () => {
    if (!apiKey.trim()) {
      alert('Masukkan Gemini API Key terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    setOutputResult('');

    const isVectorPortrait = designCategory === 'Vector Portrait';

    // System instruction dinamis berdasarkan mode yang dipilih
    const systemInstruction = isVectorPortrait ? `
You are a Senior Vector Illustrator & Professional AI Prompt Engineer specializing in Vector Portrait Grids and Art Prints.
Analyze the attached reference image (if any) and combine it with the user inputs.

CRITICAL RULE FOR LANGUAGE:
- Write ALL structural instructions, visual styles, design themes, layout instructions, and negative prompts in **Professional English** to ensure maximum AI rendering accuracy.
- Keep specific text contents provided by the user in their original language.

[USER INPUT DATA]
- Design Mode: Vector Portrait & Art Grid
- Grid Composition Type: ${gridType}
- Frame/Border Style: ${frameStyle}
- Character Title/Name: ${mainTitle}
- Character Details/Outfit: ${description}
- Orientation: ${orientation}
- Dominant Colors: ${colorPalette}
- Theme Style: ${themeStyle}
- Special Notes: ${specialNotes}

[VECTOR PORTRAIT & ART PRINT STANDARDS]
1. STYLE: High-end flat vector graphic design, Adobe Illustrator style, smooth shading gradients, clean bold outlines, professional vector perfection.
2. COMPOSITION: ${gridType}, clean symmetrical layout, clear margins.
3. FRAMING: ${frameStyle}, balanced whitespace, gallery art print aesthetic.
4. ANTI-AI LOOK: No 3D glossy airbrush, no plastic textures, no distorted human anatomy, clean vector look, no random wild texts or watermarks.

Generate the output ONLY as a structured JSON object with no opening or closing conversational text. Use the following JSON schema:
{
  "design_category": "Vector Portrait Grid & Art Print",
  "grid_composition": "${gridType}",
  "frame_style": "${frameStyle}",
  "orientation": "${orientation}",
  "rendering_quality": "8K Ultra-HD, razor-sharp vector graphic, clean vector outlines, smooth shading, print-ready",
  "vector_art_style": "Adobe Illustrator flat vector art, clean outlines, professional color blocking, vector perfection",
  "design_theme": "${themeStyle}",
  "color_scheme": "${colorPalette}",
  "character_details": "${description}",
  "title_text": "${mainTitle}",
  "precise_layout_instruction": "Clean vector portrait composition, balanced grid alignment, professional whitespace, high-end art print style matching reference.",
  "negative_prompt": "3D render, glossy, plastic look, blurry lines, distorted face, realistic photo, noisy texture, complex background, commercial phone numbers, random text"
}
    ` : `
You are a Senior Graphic Designer & Professional AI Prompt Engineer specializing in Banners & Billboards.
Analyze the attached reference image (if any) and combine it with the following user inputs.

CRITICAL RULE FOR LANGUAGE:
- Write ALL structural instructions, visual styles, design themes, layout instructions, and negative prompts in **Professional English** to ensure maximum AI rendering accuracy.
- Keep the specific text contents provided by the user (titles, subtitles, descriptions, slogans, contacts, and addresses) in their original language.

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
2. FLAT & CLEAN GRAPHIC VECTOR: The design must look like it was purely crafted using vector software (CorelDraw / Adobe Illustrator). Use sharp lines, clean grid alignment, symmetrical/proportional layout, and clear typography hierarchy.
3. HD & ULTRA SHARP: Visual quality must be "8K resolution print-ready graphic design, crisp edges, razor-sharp typography, vector perfection, high contrast, clean background".
4. TYPOGRAPHY ACCURACY: Instruct the AI renderer to generate text that is extremely clear, accurate to the letters, sharp, and free of typos/defects.

Generate the output ONLY as a structured JSON object with no opening or closing conversational text. Use the following JSON schema:
{
  "design_type": "Banner / Spanduk ${orientation}",
  "size": "${bannerSize}",
  "orientation": "${orientation}",
  "rendering_quality": "8K Ultra-HD, razor-sharp vector graphic, print-ready 300 DPI, flawless typography rendering",
  "anti_ai_visual_style": "Clean flat vector graphic design, Adobe Illustrator style, no 3D airbrush, no glossy AI artifacts, sharp clean lines, professional layout grid, minimalist corporate aesthetic",
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
  "precise_layout_instruction": "Professional symmetrical placement, balanced arrangement based on reference layout, clear visual hierarchy, ample negative space.",
  "negative_prompt": "3D render, glossy, plastic look, blurry text, distorted fonts, airbrushed, oversaturated lighting, noise, artifacts, realistic human photo artifacts, messy alignment"
}
    `;

    const contentsParts = [{ text: systemInstruction }];
    if (base64Image) {
      contentsParts.push({
        inline_data: {
          mime_type: 'image/png',
          data: base64Image,
        },
      });
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
              <h1 className="text-2xl font-bold text-blue-400">Prompt Studio Multi-Engine v2.0</h1>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] rounded-full font-semibold">
                🌐 Multi-Function Active
              </span>
            </div>
            <p className="text-xs text-slate-400">Pembangun Structured Prompt untuk Banner & Vector Portrait Grid</p>
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
            🎨 Mode Vector Portrait & Art Grid
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Form Kiri */}
          <div className="space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800 text-xs">
            
            {/* 1. DATA INFORMASI / KARAKTER */}
            <div className="space-y-2">
              <h2 className="font-bold text-blue-400 uppercase tracking-wider">
                {designCategory === 'Banner' ? '1. Data Informasi (Teks Spanduk)' : '1. Identitas & Deskripsi Karakter'}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder={designCategory === 'Banner' ? "Judul Utama (e.g. BIMBINGAN TEKNIS)" : "Nama / Judul Karakter (e.g. Seragam SMA)"} 
                  value={mainTitle} 
                  onChange={(e) => setMainTitle(e.target.value)} 
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" 
                />
                <input 
                  type="text" 
                  placeholder={designCategory === 'Banner' ? "Sub-Judul (e.g. PKB MADRASAH)" : "Detail Pakaian / Atribut (e.g. Hijab Abu)"} 
                  value={subTitle} 
                  onChange={(e) => setSubTitle(e.target.value)} 
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" 
                />
              </div>
              <input 
                type="text" 
                placeholder={designCategory === 'Banner' ? "Informasi / Detail Penawaran" : "Deskripsi Tambahan Ekspresi / Pose"} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" 
              />
              {designCategory === 'Banner' && (
                <input 
                  type="text" 
                  placeholder="Slogan / Instansi" 
                  value={slogan} 
                  onChange={(e) => setSlogan(e.target.value)} 
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" 
                />
              )}
            </div>

            {/* 2. PANEL KONTAK ATAU GRID & BINGKAI */}
            {designCategory === 'Banner' ? (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h2 className="font-bold text-blue-400 uppercase tracking-wider">2. Panel Kontak & Alamat</h2>
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" placeholder="WhatsApp (0812...)" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                  <input type="text" placeholder="Instagram (@brand)" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                  <input type="text" placeholder="TikTok (@user)" value={tiktok} onChange={(e) => setTiktok(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                </div>
                <input type="text" placeholder="Alamat / Tempat & Tanggal Kegiatan" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h2 className="font-bold text-indigo-400 uppercase tracking-wider">2. Komposisi Grid & Gaya Bingkai</h2>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Tipe Grid (e.g. 2x2 Grid Collage)" 
                    value={gridType} 
                    onChange={(e) => setGridType(e.target.value)} 
                    className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" 
                  />
                  <input 
                    type="text" 
                    placeholder="Gaya Bingkai (e.g. White Border + Colored Frame)" 
                    value={frameStyle} 
                    onChange={(e) => setFrameStyle(e.target.value)} 
                    className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" 
                  />
                </div>
              </div>
            )}

            {/* 3. BAHAN VISUAL */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h2 className="font-bold text-blue-400 uppercase tracking-wider">3. Bahan Visual & Elemen Pendukung</h2>
              {designCategory === 'Banner' && (
                <input type="text" placeholder="Daftar Nama Produk / Menu" value={productList} onChange={(e) => setProductList(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
              )}
              <input type="text" placeholder="Elemen Pendukung (e.g. Ornamen, Latar Belakang Bersih)" value={supportingElements} onChange={(e) => setSupportingElements(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
            </div>

            {/* 4. SPESIFIKASI & REFERENSI */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h2 className="font-bold text-blue-400 uppercase tracking-wider">4. Spesifikasi & Referensi Gambar</h2>
              <div className="grid grid-cols-2 gap-2">
                <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none">
                  <option value="Portrait">Portrait</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Square">Square</option>
                </select>
                <input type="text" placeholder={designCategory === 'Banner' ? "Ukuran Banner (e.g. 300x100)" : "Ukuran Kertas (e.g. A4)"} value={bannerSize} onChange={(e) => setBannerSize(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Warna Dominan (e.g. Blue, Maroon, White)" value={colorPalette} onChange={(e) => setColorPalette(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                <input type="text" placeholder="Tema Desain (e.g. Flat Vector Art)" value={themeStyle} onChange={(e) => setThemeStyle(e.target.value)} className="p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
              </div>

              {/* Upload Box dengan Tombol Hapus */}
              <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center bg-slate-900/50 relative">
                {!imagePreview ? (
                  <>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <p className="text-slate-400 py-2">Klik / Drag / Paste (Ctrl+V) foto referensi ke sini</p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="relative inline-block group">
                      <img src={imagePreview} alt="Preview" className="max-h-36 mx-auto rounded border border-slate-700 object-contain" />
                    </div>
                    <div>
                      <button 
                        onClick={removeImage}
                        type="button"
                        className="px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white font-medium rounded text-[10px] transition shadow"
                      >
                        🗑️ Hapus Gambar Referensi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 5. PERINTAH KHUSUS */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h2 className="font-bold text-blue-400 uppercase tracking-wider">5. Perintah Khusus</h2>
              <textarea rows="2" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="E.g. Ambil data dan gambar dari referensi" className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none"></textarea>
            </div>

            <button onClick={generatePrompt} className={`w-full py-2.5 font-bold text-white rounded transition shadow-lg ${designCategory === 'Banner' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'}`}>
              Generate {designCategory === 'Banner' ? 'Banner' : 'Vector Portrait'} JSON Prompt →
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
                  <p>Gemini sedang menyusun Professional English JSON Prompt...</p>
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
