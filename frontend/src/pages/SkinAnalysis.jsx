import React, {
  useState,
  useEffect,
  useRef
} from 'react';

import api from '../services/api';

const SkinAnalysis = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [image, setImage] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedFile, setSelectedFile] =

  useState(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [analysisResult, setAnalysisResult] =
    useState(null);

  const [history, setHistory] =
    useState([]);
  const handleFileUpload = (e) => {

  const file =
    e.target.files[0];

      if (!file) return;

      setSelectedFile(file);

      setImage(
        URL.createObjectURL(file)
      );

      setShowResult(false);

      setAnalysisResult(null);
    };

  const startAnalysis =
  async () => {

    if (!selectedFile) {
      alert(
        "Pilih gambar terlebih dahulu"
      );
      return;
    }

    try {

      setIsScanning(true);

      const formData =
        new FormData();

      formData.append(
        "image",
        selectedFile
      );

      // const token =
      //   localStorage.getItem(
      //     "token"
      //   );
        const token =
  localStorage.getItem("token");

console.log("TOKEN:", token);
      const response =
        await api.post(
          "/skin/analyze",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      console.log(
        response.data
      );

      setAnalysisResult(
        response.data.data
      );

      setShowResult(true);

      fetchHistory();

    } catch (error) {

      alert(
        error.response?.data
          ?.message ||
          "Analisis gagal"
      );

    } finally {

      setIsScanning(false);

    }
};

  useEffect(() => {
  fetchHistory();
}, []);

const fetchHistory = async () => {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await api.get(
        "/skin/history",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    setHistory(
      response.data.data
    );

  } catch (error) {

    console.log(error);

  }
};
  const handleCameraCapture = () => {
  cameraInputRef.current?.click();
  };

const startCamera = async () => {
  try {

    setCameraOpen(true);

    setTimeout(async () => {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true
        });

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;
      }

    }, 200);

  } catch (error) {

    console.error(
      "CAMERA ERROR:",
      error
    );

    alert(error.message);

  }
};
const capturePhoto = () => {

  const canvas =
    canvasRef.current;

  const video =
    videoRef.current;

  const context =
    canvas.getContext("2d");

  canvas.width =
    video.videoWidth;

  canvas.height =
    video.videoHeight;

  context.drawImage(
    video,
    0,
    0
  );

  canvas.toBlob((blob) => {

    const file =
      new File(
        [blob],
        "camera.jpg",
        {
          type: "image/jpeg"
        }
      );

    setSelectedFile(file);

    setImage(
      URL.createObjectURL(file)
    );

    setCameraOpen(false);

    const tracks =
      video.srcObject.getTracks();

    tracks.forEach(
      track =>
        track.stop()
    );

  }, "image/jpeg");

};


  return (
    
    <div className="animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-10">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-manrope font-bold text-on-surface mb-3">AI Skin Detection</h2>
          <p className="text-on-surface-variant leading-relaxed">
            Deteksi kondisi kulit Anda secara instan menggunakan kecerdasan buatan medis tercanggih. 
            Dapatkan analisis detail dan rekomendasi perawatan personal dalam hitungan detik.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Engine Active</span>
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        
        {/* CENTER: Area Unggah */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="w-full relative aspect-square max-w-[450px] rounded-[24px] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
            {image ? (
              <>
                <img src={image} className="w-full h-full object-cover" alt="Skin target" />
                {isScanning && (
                  <div className="absolute inset-0 z-20">
                    <div className="w-full h-1 bg-primary shadow-[0_0_20px_#4fbdba] absolute top-0 animate-scan"></div>
                    <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                  </div>
                )}
                {/* Fokus Target AI Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-40 border-2 border-primary/40 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary"></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-10">
                <span className="material-symbols-outlined text-7xl text-slate-200 mb-4">image_search</span>
                <h4 className="text-xl font-bold text-slate-400 mb-2">Unggah Foto Kulit</h4>
                <p className="text-xs text-slate-400">Tarik-lepas file atau klik untuk memilih gambar</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4 w-full max-w-[450px]">
            {cameraOpen && (
              <div className="fixed inset-0 bg-black/80 z-[9999] flex flex-col items-center justify-center">

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-[90%] max-w-lg rounded-2xl"
                />

                <button
                  onClick={capturePhoto}
                  className="mt-6 bg-primary text-white px-6 py-3 rounded-xl"
                >
                  Ambil Foto
                </button>

                <canvas
                  ref={canvasRef}
                  className="hidden"
                />

              </div>
            )}
          <button
            onClick={startCamera}
            className="flex-1 bg-slate-100 text-on-surface-variant py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
            <span className="material-symbols-outlined text-xl">
              photo_camera
            </span>
            Ambil Foto
          </button>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="flex-1 relative">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileUpload} />
              <button className="w-full bg-primary-container/20 text-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-primary/20">
                <span className="material-symbols-outlined text-xl">upload_file</span> Pilih File
              </button>
            </div>
          </div>
          
          
          {image && !showResult && (
            <button 
              onClick={startAnalysis} 
              className="mt-4 w-full max-w-[450px] bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 animate-bounce"
            >
              {isScanning ? 'Menganalisis...' : 'Mulai Deteksi AI Sekarang'}
            </button>
          )}
        </div>

        {/* Kanan: Hasil */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* Status Deteksi Card */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Analisis Terbaru</p>
                  <h4 className="text-2xl font-bold text-on-surface">Terdeteksi:
                    <span className="text-primary">{analysisResult?.condition ||"---"}</span></h4>
                </div>
                {
                  analysisResult && (
                    <div className="mt-3">
                      <p className="text-sm text-slate-600">
                        Confidence:
                        <strong className="text-primary ml-1">
                          {analysisResult.confidence}%
                        </strong>
                      </p>
                    </div>
                  )
                }
                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
             </div>
             
             <div className="space-y-5">

              {/* Eczema & Dermatitis */}
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-2 uppercase">
                  <span>Eczema & Dermatitis</span>
                  <span className="text-primary">
                    {
                      analysisResult?.probabilities?.[
                        "Eczema & Dermatitis"
                      ]
                        ? (
                            analysisResult.probabilities[
                              "Eczema & Dermatitis"
                            ] * 100
                          ).toFixed(2)
                        : "0"
                    }%
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{
                      width:
                        analysisResult?.probabilities?.[
                          "Eczema & Dermatitis"
                        ]
                          ? `${
                              analysisResult.probabilities[
                                "Eczema & Dermatitis"
                              ] * 100
                            }%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>

              {/* Infections */}
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-2 uppercase">
                  <span>Infections</span>
                  <span className="text-orange-400">
                    {
                      analysisResult?.probabilities?.[
                        "Infections"
                      ]
                        ? (
                            analysisResult.probabilities[
                              "Infections"
                            ] * 100
                          ).toFixed(2)
                        : "0"
                    }%
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 transition-all duration-1000"
                    style={{
                      width:
                        analysisResult?.probabilities?.[
                          "Infections"
                        ]
                          ? `${
                              analysisResult.probabilities[
                                "Infections"
                              ] * 100
                            }%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>

              {/* Acne & Rosacea */}
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-2 uppercase">
                  <span>Acne & Rosacea</span>
                  <span className="text-indigo-400">
                    {
                      analysisResult?.probabilities?.[
                        "Acne & Rosacea"
                      ]
                        ? (
                            analysisResult.probabilities[
                              "Acne & Rosacea"
                            ] * 100
                          ).toFixed(2)
                        : "0"
                    }%
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 transition-all duration-1000"
                    style={{
                      width:
                        analysisResult?.probabilities?.[
                          "Acne & Rosacea"
                        ]
                          ? `${
                              analysisResult.probabilities[
                                "Acne & Rosacea"
                              ] * 100
                            }%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>

            </div>
          </div>

          {/* Rekomendasi AI */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex-1">
             <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                <h4 className="font-bold text-on-surface">Rekomendasi AI</h4>
             </div>
             <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-center">
                   <div className="p-2 bg-white rounded-xl shadow-sm"><span className="material-symbols-outlined text-primary">sanitizer</span></div>
                   <div>
                      <p className="font-bold text-sm">Moisturizer Gel</p>
                      <p className="text-[10px] text-slate-500">Gunakan pelembab berbasis air.</p>
                   </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-center">
                   <div className="p-2 bg-white rounded-xl shadow-sm"><span className="material-symbols-outlined text-orange-400">wb_sunny</span></div>
                   <div>
                      <p className="font-bold text-sm">Sunscreen SPF 50+</p>
                      <p className="text-[10px] text-slate-500">Perlindungan UV ekstra pagi hari.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">

        {history.length > 0 ? (

          history.map((item) => (

            <div
              key={item.id}
              className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl"
            >

              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200">

                <img
                  src={`${import.meta.env.VITE_API_URL || "http://localhost:5002"}${item.image_url}`}
                  alt={item.prediction}
                  className="w-full h-full object-cover"
                />

              </div>

              <div className="flex-1">

                <h5 className="font-semibold text-sm text-on-surface">
                  {item.prediction}
                </h5>

                <p className="text-xs text-primary font-medium">
                  Confidence: {item.confidence}%
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  {new Date(
                    item.created_at
                  ).toLocaleDateString()}
                </p>

              </div>

            </div>

          ))

                ) : (

          <div className="text-center py-8">

            <span className="material-symbols-outlined text-4xl text-slate-300">
              history
            </span>

            <p className="text-sm text-slate-400 mt-2">
              Belum ada riwayat analisis
            </p>

          </div>

        )}

      </div>

        {/* Riwayat Deteksi */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">

          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold">
              Riwayat Deteksi
            </h4>
          </div>

          <div className="space-y-4">

            {history.length > 0 ? (

              history.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl"
                >

                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200">

                    <img
                      src={`${import.meta.env.VITE_API_URL || "http://localhost:5002"}${item.image_url}`}
                      alt={item.prediction}
                      className="w-full h-full object-cover"
                    />

                  </div>

                  <div className="flex-1">

                    <h5 className="font-semibold text-sm">
                      {item.prediction}
                    </h5>

                    <p className="text-xs text-primary">
                      Confidence: {item.confidence}%
                    </p>

                    <p className="text-[10px] text-slate-400">
                      {new Date(
                        item.created_at
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

              ))

            ) : (

              <div className="text-center py-8">

                <span className="material-symbols-outlined text-4xl text-slate-300">
                  history
                </span>

                <p className="text-sm text-slate-400 mt-2">
                  Belum ada riwayat analisis
                </p>

              </div>

            )}

          </div>

        </div>


      {/* Style untuk Animasi Scan */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanAnim {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scanAnim 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default SkinAnalysis;