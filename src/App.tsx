@@
   const [personMode, setPersonMode] = useState(false);
   const personModeRef = useRef(false);
   const [personTarget, setPersonTarget] = useState<string | null>(null);
+  // Uji Nyali mode
+  const [ujiNyaliMode, setUjiNyaliMode] = useState(false);
+  const ujiNyaliModeRef = useRef(false);
@@
   useEffect(() => { personModeRef.current = personMode; }, [personMode]);
+  useEffect(() => { ujiNyaliModeRef.current = ujiNyaliMode; }, [ujiNyaliMode]);
@@
   const clearOtherModes = useCallback(() => {
@@
     setPersonMode(false);
     personModeRef.current = false;
     setPersonTarget(null);
+    // nonaktifkan uji nyali juga
+    setUjiNyaliMode(false);
+    ujiNyaliModeRef.current = false;
   }, []);
@@
             <button onClick={() => {
               if (isModeSwitching) return;
               clearOtherModes();
               setPersonMode(true);
               personModeRef.current = true;
               setPersonTarget(null);
               setIsAutoPlaying(true);
               autoPlayRef.current = true;
               setPhase('idle');
               setCurrentProlog(null);
               toast.success('👤 Mode Person aktif — pilih peserta.');
             }} className={`glow-btn ${personMode ? 'glow-btn--active glow-btn--cyan' : 'glow-btn--cyan'}`} title="Mode Person" disabled={isModeSwitching}>
               <Users className="w-4 h-4" />
             </button>
+
+            <button
+              onClick={() => {
+                if (isModeSwitching) return;
+                clearOtherModes();
+                setUjiNyaliMode(true);
+                ujiNyaliModeRef.current = true;
+                setPersonMode(false);
+                personModeRef.current = false;
+                setDuelMode(false);
+                duelModeRef.current = false;
+                setSidangNyataMode(false);
+                sidangNyataModeRef.current = false;
+                setDeepMode(false);
+                deepModeRef.current = false;
+                setKeputusanMode(false);
+                keputusanModeRef.current = false;
+                setUndianMode(false);
+                undianModeRef.current = false;
+                setPersonTarget(null);
+                setPhase('idle');
+                setCurrentProlog(null);
+                toast.success('🧠 Uji Nyali aktif — pilih peserta di panel Uji Nyali.');
+              }}
+              className={`glow-btn ${ujiNyaliMode ? 'glow-btn--active glow-btn--indigo' : 'glow-btn--indigo'}`}
+              title="Uji Nyali"
+              disabled={isModeSwitching}
+            >
+              <Users className="w-4 h-4" />
+            </button>
*** End Patch
