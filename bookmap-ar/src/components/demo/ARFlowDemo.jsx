import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Map, Navigation, CheckCircle, Share2, X, ChevronRight, BookOpen } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, useGLTF, useAnimations, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// -------------------------------------------------------------
// Component Nhân vật 3D (AR Character)
// -------------------------------------------------------------
function LittlePrince3DModel({ currentStep }) {
  const meshRef = useRef();

  // Tạo hiệu ứng xoay chầm chậm cho khối kim cương thay thế
  useFrame((state, delta) => {
    if (meshRef.current) {
      const speed = currentStep === 3 ? 1.5 : 0.5;
      meshRef.current.rotation.y += delta * speed;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  /* HƯỚNG DẪN DÙNG MODEL 3D CÓ ANIMATION (CHUYỂN ĐỘNG / ĐI BỘ):
     1. Tải một model .glb đã được gắn xương (Rigged) và cài sẵn các Animation (như 'Run', 'Walk', 'Idle') từ Mixamo, Sketchfab.
     2. Đặt tên file là `little-prince-animated.glb` và quẳng vào thư mục `public/assets/`.
     3. Xóa dấu comment (//) ở đoạn code bên dưới và XÓA thẻ <group ref={meshRef}> chứa khối Octahedron đi.
  */
  
  /* ---> BỎ COMMENT ĐOẠN NÀY ĐỂ KÍCH HOẠT NHÂN VẬT THỰC SỰ
  const { scene, animations } = useGLTF('/assets/little-prince-animated.glb')
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    console.log("Các hành động có sẵn của Model:", actions)
    // Nếu model có animation tên là 'Walk' và 'Idle'
    if (currentStep === 3 && actions['Walk']) {
      actions['Walk'].play()
      if (actions['Idle']) actions['Idle'].stop()
    } else if (actions['Idle']) {
      actions['Idle'].play()
      if (actions['Walk']) actions['Walk'].stop()
    }
  }, [currentStep, actions])

  return <primitive object={scene} scale={1.2} position={[0, -1, 0]} />
  <--- */

  // HIỂN THỊ TẠM THỜI: Khối kim cương phát sáng mô phỏng dẫn đường
  return (
    <group ref={meshRef}>
      <mesh castShadow>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          color="#F36B21" 
          emissive="#F36B21" 
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.8}
          transmission={0.5}
          thickness={0.5}
          wireframe={currentStep === 3}
        />
      </mesh>
      <mesh scale={0.5}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// Luồng Chính AR Flow
// -------------------------------------------------------------
export default function ARFlowDemo() {
  const [step, setStep] = useState(1);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);

  const nextStep = () => { if (step < 6) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraReady(true);
          }
        }
      } catch (err) {
        console.error("Camera access denied", err);
        setCameraReady(false);
      }
    };
    
    // Bật camera ở các bước AR
    if (step >= 3 && step <= 6) {
      startCamera();
    } else {
      setCameraReady(false);
      if (stream) stream.getTracks().forEach(t => t.stop());
    }

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [step]);

  // Framer Motion variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    in: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    out: { opacity: 0, scale: 1.05, filter: 'blur(10px)' }
  };

  return (
    <div 
      onClick={nextStep} 
      className="cursor-pointer flex flex-col md:items-center min-h-[100dvh] bg-black font-sans text-slate-100 overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-space-light via-space-dark to-black opacity-60 z-0"></div>

      {/* Full Screen App Container */}
      <div className="relative w-full h-full flex-1 max-w-[600px] bg-black overflow-hidden z-10 flex flex-col shadow-2xl">

        <AnimatePresence mode="wait">
          {/* STEP 1: Permission */}
          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="initial" animate="in" exit="out" className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200')] bg-cover bg-center flex items-center justify-center p-6 z-40">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xl"></div>
              
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative bg-white/10 backdrop-blur-2xl rounded-3xl w-full p-6 shadow-2xl border border-white/20 flex flex-col items-center border-t-white/40">
                <div className="w-16 h-16 bg-neon-orange/20 rounded-full flex items-center justify-center mb-4">
                  <Camera className="text-neon-orange w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-white tracking-tight">Access Camera</h3>
                <p className="text-sm text-slate-300 text-center mb-6 leading-relaxed">BookMap AR uses your camera to overlay a real-time 3D character directly into your world.</p>
                <div className="flex w-full gap-3">
                  <button onClick={nextStep} className="flex-1 py-3.5 text-sm font-semibold text-slate-300 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">Maybe Later</button>
                  <button onClick={nextStep} className="flex-1 py-3.5 text-sm font-bold text-black bg-neon-cyan rounded-2xl hover:brightness-110 shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-all">Allow Access</button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: Beautiful 2D Map */}
          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="initial" animate="in" exit="out" className="absolute inset-0 bg-space-dark flex flex-col">
              <div className="pt-16 pb-4 px-6 bg-black/40 backdrop-blur-lg flex items-center justify-between z-10 border-b border-white/5">
                <div className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
                  <Map className="text-neon-cyan" /> 2D Radar
                </div>
                <div className="text-xs font-bold text-neon-orange bg-neon-orange/10 border border-neon-orange/20 px-3 py-1.5 rounded-full tracking-wider">LEVEL G</div>
              </div>
              
              <div className="flex-1 relative overflow-hidden bg-[#0A0B10]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#66FCF111_1px,transparent_1px),linear-gradient(to_bottom,#66FCF111_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[15%] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-xs font-bold text-slate-500">Coffee</div>
                
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute top-[40%] right-[10%] w-[40%] h-[30%] bg-neon-orange/10 backdrop-blur-md rounded-2xl border border-neon-orange/50 flex flex-col items-center justify-center text-neon-orange shadow-[0_0_30px_rgba(243,107,33,0.15)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-neon-orange/20 to-transparent"></div>
                  <BookOpen className="w-8 h-8 mb-2 relative z-10" />
                  <span className="font-display font-bold text-lg relative z-10">Kim Đồng</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-80 relative z-10">Destination</span>
                </motion.div>
                
                <div className="absolute bottom-[20%] left-[30%] w-[20%] h-[10%] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-xs font-bold text-slate-500">Exit</div>

                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-[10%] left-[50%] w-6 h-6 bg-neon-cyan rounded-full shadow-[0_0_20px_#66FCF1] flex items-center justify-center z-20">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
                <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                  <path d="M196,700 Q196,500 280,450" fill="none" stroke="#F36B21" strokeWidth="4" strokeDasharray="8,8" className="animate-[dash_1s_linear_infinite] drop-shadow-[0_0_8px_rgba(243,107,33,0.6)]" />
                </svg>
              </div>
              
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="p-6 bg-black/60 backdrop-blur-2xl rounded-t-[40px] border-t border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] z-20">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="font-display font-bold text-xl text-white mb-1">Kim Đồng Publisher</p>
                    <p className="text-slate-400 text-sm">Main Hall • 2 min walk</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-neon-cyan">35m</p>
                  </div>
                </div>
                <button onClick={nextStep} className="w-full bg-gradient-to-r from-neon-teal to-neon-cyan text-black py-4 rounded-2xl font-bold text-[17px] shadow-[0_0_20px_rgba(102,252,241,0.3)] hover:brightness-110 active:scale-95 transition-all flex justify-center items-center gap-2">
                  <Camera className="w-5 h-5" /> LAUNCH 3D AR
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* STEPS 3-6: AR View Flow */}
          {step >= 3 && step <= 6 && (
            <motion.div key="step3-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black flex flex-col justify-end overflow-hidden">
              
              {/* Camera Background */}
              <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${cameraReady ? 'opacity-100' : 'opacity-0'}`} />
              
              {!cameraReady && (
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200')] bg-cover bg-center brightness-50"></div>
              )}

              {/* Lớp Overlay 3D Real-time sử dụng Fiber */}
              {step !== 5 && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -5]} color="#66FCF1" intensity={0.5} />
                    
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                      {/* Vị trí của nhân vật lơ lửng trên màn hình */}
                      <group position={[0, Math.min(1, step * 0.2), 0]}>
                        <LittlePrince3DModel currentStep={step} />
                      </group>
                    </Float>

                    {/* Tạo bóng dưới gầm mô hình ảo */}
                    <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
                  </Canvas>
                </div>
              )}
              
              {/* HUD Toggles */}
              <div className="absolute top-14 inset-x-0 px-6 flex justify-between items-center z-30">
                <button onClick={() => setStep(2)} className="w-12 h-12 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/10">
                  <X />
                </button>
                <div className="bg-black/40 backdrop-blur-xl rounded-full p-1.5 flex border border-white/10">
                  <button onClick={() => setStep(2)} className="px-5 py-2 text-sm font-semibold text-white/50 rounded-full">Radar</button>
                  <button className="px-5 py-2 text-sm font-bold text-black bg-neon-cyan rounded-full shadow-[0_0_15px_rgba(102,252,241,0.4)]">3D Vision</button>
                </div>
              </div>

              {/* Speech Bubble */}
              {step !== 5 && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-[35%] left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="relative bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 mb-4 border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-[280px] text-center whitespace-pre-wrap font-bold text-white text-[16px] z-10">
                    {step === 3 && "Follow my 3D Avatar!"}
                    {step === 4 && <span className="text-neon-cyan">Destination Reached!<br/>Here is Kim Đồng.</span>}
                    {step === 6 && "Goodbye!\nEnjoy your journey!"}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/10 backdrop-blur-xl border-b border-r border-white/20 rotate-45" />
                  </motion.div>
                </motion.div>
              )}

              {/* Bottom Panels */}
              <div className="w-full p-6 pb-10 flex flex-col items-center gap-4 z-20">
                <AnimatePresence mode="popLayout">
                  {step === 3 && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="w-full bg-black/60 backdrop-blur-2xl rounded-[24px] p-5 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-neon-cyan uppercase tracking-widest mb-1 flex items-center gap-1"><Navigation className="w-3 h-3"/> NAVIGATING</span>
                        <span className="text-white font-display font-bold text-[18px]">Kim Đồng Publisher</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xl px-4 py-2 rounded-xl">35m</div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.button initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={nextStep} className="w-full max-w-[300px] bg-neon-orange text-black py-[18px] rounded-[24px] font-display font-bold text-[18px] shadow-[0_0_30px_rgba(243,107,33,0.5)] hover:scale-105 active:scale-95 transition-all mb-4 flex items-center justify-center gap-2">
                       ENTER BOOTH <ChevronRight />
                    </motion.button>
                  )}

                  {step === 5 && (
                    <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute inset-0 bg-space-dark/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 z-30">
                      <div className="bg-black/60 backdrop-blur-3xl rounded-[40px] w-full max-w-[340px] p-8 text-center border border-white/10 shadow-[0_0_50px_rgba(102,252,241,0.1)]">
                        <h2 className="text-[24px] font-display font-bold text-white mb-8 tracking-tight flex items-center justify-center gap-2"><Map className="text-neon-cyan"/> Shelf Radar</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white/5 rounded-2xl aspect-[4/3] flex items-center justify-center font-bold text-slate-500 border border-white/5">A1</div>
                          <div className="bg-white/5 rounded-2xl aspect-[4/3] flex items-center justify-center font-bold text-slate-500 border border-white/5">A2</div>
                          <div className="bg-neon-orange/10 border border-neon-orange rounded-2xl aspect-[4/3] relative flex items-center justify-center shadow-[0_0_20px_rgba(243,107,33,0.2)inset]">
                              <span className="font-display font-bold text-neon-orange text-lg">B3</span>
                              <div className="absolute w-4 h-4 bg-neon-cyan rounded-full top-3 right-3 shadow-[0_0_15px_#66FCF1] animate-pulse" />
                          </div>
                          <div className="bg-white/5 rounded-2xl aspect-[4/3] flex items-center justify-center font-bold text-slate-500 border border-white/5">B4</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 mt-8 mb-8 border border-white/10 text-left">
                          <p className="text-xs font-bold text-neon-cyan uppercase tracking-widest mb-1">Target Located</p>
                          <p className="font-medium text-white text-md">The Little Prince • Shelf B3</p>
                        </div>
                        <button onClick={nextStep} className="w-full bg-neon-cyan text-black py-[18px] rounded-[24px] font-bold text-[17px] shadow-[0_0_20px_rgba(102,252,241,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5"/> BOOK FOUND
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 6 && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center w-full gap-4 pb-4">
                      <button className="w-full max-w-[320px] bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white py-[18px] rounded-[24px] font-bold text-[17px] shadow-[0_0_30px_rgba(142,45,226,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Share2 className="w-5 h-5" /> SHARE AR MOMENT
                      </button>
                      <button onClick={() => setStep(1)} className="text-white/50 font-semibold text-[15px] bg-transparent border border-white/10 px-8 py-4 rounded-[24px] hover:bg-white/5 transition-colors">
                        End Session
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
