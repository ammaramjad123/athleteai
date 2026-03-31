import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

// EmailJS Configuration - Replace with your actual keys
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',
  SERVICE_ID: 'service_athleteai',
  TEMPLATE_ID: 'template_waitlist'
};

function App() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize EmailJS
  useEffect(() => {
    if (EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
  }, []);

  const saveEmail = async (userEmail) => {
    const existingEmails = JSON.parse(localStorage.getItem('athlete_ai_waitlist') || '[]');
    
    if (existingEmails.includes(userEmail)) {
      setStatus({ type: 'info', message: '✨ Already on the list! You\'re in.' });
      return false;
    }

    const updatedEmails = [...existingEmails, userEmail];
    localStorage.setItem('athlete_ai_waitlist', JSON.stringify(updatedEmails));

    if (EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          { user_email: userEmail, to_email: userEmail }
        );
      } catch (error) {}
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const success = await saveEmail(email);
    if (success) {
      setStatus({ type: 'success', message: '✅ Welcome! Check your inbox.' });
      setEmail('');
    }
    
    setIsSubmitting(false);
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const exportToCSV = () => {
    const emails = JSON.parse(localStorage.getItem('athlete_ai_waitlist') || '[]');
    if (emails.length === 0) return;
    
    const csvContent = "data:text/csv;charset=utf-8,Email,Date\n" + 
      emails.map(e => `${e},${new Date().toISOString()}`).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "athlete_ai_waitlist.csv");
    link.click();
    setStatus({ type: 'success', message: '📥 Emails exported!' });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const scalePop = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { type: "spring", stiffness: 200, damping: 15 } 
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-['Montserrat']">
      {/* Animated Background Orbs */}
      <motion.div
        animate={{
          x: mousePosition.x * 1.5,
          y: mousePosition.y * 1.5,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
        className="fixed top-[15%] left-[10%] w-[500px] h-[500px] bg-[#00A3FF] rounded-full blur-[120px] opacity-8 pointer-events-none"
      />
      <motion.div
        animate={{
          x: -mousePosition.x,
          y: -mousePosition.y,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
        className="fixed bottom-[15%] right-[10%] w-[600px] h-[600px] bg-[#00A3FF] rounded-full blur-[140px] opacity-6 pointer-events-none"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00A3FF] rounded-full blur-[160px] opacity-4 pointer-events-none animate-pulse-slow" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-3 sm:py-6 max-w-[1200px] mx-auto">
        
       {/* Logo */}
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="mb-2 sm:mb-6 md:mb-2 lg:mb-2 cursor-pointer text-center w-full flex justify-center items-center group"
  onClick={(e) => { if (e.detail === 3) exportToCSV(); }}
  whileHover={{ scale: 1.02 }}
>
  <div className="flex flex-col items-center">
    <img src="/logo.png" alt="Athlete.AI" className="h-38 sm:h-24 md:h-40 lg:h-50 w-auto drop-shadow-[0_0_20px_rgba(0,163,255,0.2)] transition-all duration-300 mx-auto" />
   
  </div>
</motion.div>

        {/* Animated Headline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <motion.div variants={fadeInUp} className="font-['Bebas_Neue'] font-normal tracking-[0.02em] leading-[1.1] text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl">
            We watched your last session
          </motion.div>
          
          <motion.div
            variants={scalePop}
            className="relative inline-block my-2 sm:my-3 md:my-4"
          >
            <div className="font-['Bebas_Neue'] font-normal tracking-[0.02em] leading-[1.1] bg-gradient-to-r from-[#00A3FF] to-[#00A3FF] bg-clip-text text-transparent inline-block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[115px]">
             We need to talk
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent"
            />
          </motion.div>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-[#00A3FF] text-sm sm:text-base md:text-lg font-medium text-center max-w-[700px] mb-6 sm:mb-8 md:mb-10 px-4 leading-relaxed"
        >
          The World's First AI Coaching App That Watches You Train In Real Time
        </motion.p>

        {/* Sport Icons */}

  <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.5, duration: 0.5 }}
  className="flex flex-nowrap justify-start md:justify-center items-center 
             gap-4 sm:gap-5 md:gap-6 
             mb-8 sm:mb-10 md:mb-12
             px-4 sm:px-8 md:px-0
             overflow-x-auto md:overflow-visible
             whitespace-nowrap
             scroll-px-6"
>
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-3xl sm:text-4xl md:text-5xl cursor-default">🏀</motion.span>
          <span className="text-white text-sm sm:text-base md:text-lg font-medium">Basketball</span>
          <span className="text-[#00A3FF] opacity-50 text-base sm:text-lg md:text-xl">•</span>
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="text-3xl sm:text-4xl md:text-5xl cursor-default">⛳</motion.span>
          <span className="text-white text-sm sm:text-base md:text-lg font-medium">Golf</span>
          <span className="text-[#00A3FF] opacity-50 text-base sm:text-lg md:text-xl">•</span>
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="text-3xl sm:text-4xl md:text-5xl cursor-default">⚽</motion.span>
          <span className="text-white text-sm sm:text-base md:text-lg font-medium">Soccer</span>
        </motion.div>
       

       {/* Value Cards */}
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
  className="grid 
             grid-cols-1 
             sm:grid-cols-2 
             lg:grid-cols-4
             gap-4 sm:gap-5 md:gap-6 
             w-full max-w-[1200px] 
             mb-8 sm:mb-10 md:mb-12 
             px-2"
>
  {[
    { icon: '⚡', title: 'Live AI Coaching', desc: 'Real-time feedback in your AirPods' },
    { icon: '🎯', title: 'Pro Athlete Training', desc: 'Train like your favorite pro athlete in real time' },
    { icon: '📊', title: 'Advanced Analytics', desc: 'Track every rep. See your improvement daily' },
    { icon: '🔥', title: 'Share Your Journey', desc: 'Post your session results directly to Instagram and TikTok and challenge your friends' }
  ].map((item, idx) => (
    <motion.div
      key={idx}
      variants={scalePop}
      whileHover={{ y: -8 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl 
                 p-5 sm:p-6 md:p-7 
                 border border-white/10 
                 hover:border-[#00A3FF]/30 
                 transition-all duration-300 cursor-pointer 
                 text-center 
                 flex flex-col lg:h-full"
    >
      {/* Icon */}
      <div className="text-4xl sm:text-5xl md:text-6xl mb-3">
        {item.icon}
      </div>

      {/* Title */}
     <h3
  className="text-white text-base sm:text-lg md:text-xl 
             font-bold mb-2 
             lg:whitespace-nowrap 
             lg:min-h-[56px] 
             lg:flex lg:items-center lg:justify-center"
>
  {item.title}
</h3>
      {/* Description */}
      <p className="text-gray-400 text-xs sm:text-sm md:text-base 
                    leading-relaxed 
                    lg:min-h-[72px]">
        {item.desc}
      </p>
    </motion.div>
  ))}
</motion.div>

        {/* Urgency Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-6 sm:mb-8 md:mb-10 px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-[#00A3FF]/10 to-transparent rounded-full border border-[#00A3FF]/20"
        >
          <motion.p
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[#00A3FF] text-[10px] sm:text-xs font-bold tracking-wider whitespace-nowrap sm:whitespace-normal sm:text-center"
          >
            ⚡ LIMITED EARLY ACCESS — BE FIRST ⚡
          </motion.p>
        </motion.div>

     {/* Email Form */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
  className="w-full max-w-[500px] mb-6 sm:mb-8 md:mb-10 px-4"
>
  <form onSubmit={handleSubmit} className="w-full">
    {/* Mobile: Column layout, Desktop: Row layout */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:relative">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={isSubmitting}
        className="w-full py-3.5 sm:py-4 px-5 sm:pl-5 sm:pr-[100px] bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-gray-500 text-base sm:text-sm md:text-base outline-none focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20 transition-all duration-300 font-['Montserrat'] placeholder:text-base sm:placeholder:text-sm md:placeholder:text-base"
      />
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 w-full sm:w-auto py-3 sm:py-1.5 md:py-2 px-6 sm:px-4 md:px-6 bg-[#00A3FF] hover:bg-[#0088dd] border-none rounded-xl sm:rounded-lg text-black font-bold text-sm sm:text-xs md:text-sm cursor-pointer transition-all duration-300 whitespace-nowrap"
      >
        {isSubmitting ? 'JOINING...' : 'GET ACCESS →'}
      </motion.button>
    </div>
  </form>
  
  <AnimatePresence>
    {status.message && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`mt-3 text-xs text-center ${
          status.type === 'error' ? 'text-red-400' : 
          status.type === 'success' ? 'text-[#00A3FF]' : 'text-gray-400'
        }`}
      >
        {status.message}
      </motion.p>
    )}
  </AnimatePresence>
</motion.div>

       {/* Social Proof - Enhanced Version */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.9, duration: 0.5 }}
  className="flex flex-col items-center justify-center gap-4 sm:gap-3 mb-8 sm:mb-10 md:mb-12"
>
  {/* Avatars with animation */}
  <div className="flex items-center justify-center">
    <div className="flex -space-x-2 sm:-space-x-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9 + (i * 0.05), type: "spring", stiffness: 200 }}
          className="relative"
        >
          <div className="w-8 h-8 sm:w-9 md:w-10 lg:w-11 h-8 sm:h-9 md:h-10 lg:h-11 rounded-full bg-gradient-to-br from-[#00A3FF] to-[#00FFFF] border-2 border-black shadow-lg shadow-[#00A3FF]/20" />
          {/* Optional: Add verification badge */}
          {i === 1 && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-black" />
          )}
        </motion.div>
      ))}
    </div>
  </div>
  
  {/* Stats with counter animation */}
<div className="text-center">
  <div className="flex items-center justify-center gap-2 flex-wrap">
    <motion.span 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#00A3FF] to-[#00FFFF] bg-clip-text text-transparent whitespace-nowrap"
    >
      Be among the first to get access
    </motion.span>
  </div>

  <motion.p 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.1 }}
    className="text-gray-400 text-xs sm:text-sm mt-3 max-w-md mx-auto"
  >
   
  </motion.p>
</div>
  

</motion.div>

       {/* Sport Line - Enhanced Version */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1, duration: 0.6 }}
  className="relative w-full max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 px-4"
>
  {/* Decorative lines */}
  <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#00A3FF]/20 to-transparent -z-10"></div>
  
  <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10 hover:border-[#00A3FF]/30 transition-all duration-300">
    <div className="flex flex-col items-center text-center">
      {/* Icon row */}
      <div className="flex gap-3 mb-3">
        <span className="text-xl sm:text-2xl">🏀</span>
        <span className="text-[#00A3FF] text-sm sm:text-base">+</span>
        <span className="text-xl sm:text-2xl">⛳</span>
        <span className="text-[#00A3FF] text-sm sm:text-base">+</span>
         <span className="text-xl sm:text-2xl">⚽</span>
       
      </div>
      
      {/* Main text */}
      <p className="text-white text-sm sm:text-base md:text-lg font-medium leading-relaxed">
       Your potential called, It's tired of waiting
        <br className="hidden sm:block" />
        
      </p>
      
      {/* Highlighted text */}
      <div className="mt-2">
        <span className="text-[#00A3FF] text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-[#00A3FF] to-[#00FFFF] bg-clip-text text-transparent">
          Athlete.AI — stop leaving it on the table
        </span>
      </div>
      
      {/* Subtle badge */}
      <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full">
        <span className="text-[#00A3FF] text-[10px] sm:text-xs">✓</span>
        <span className="text-gray-400 text-[9px] sm:text-[10px]">AI-powered coaching for 20+ sports</span>
      </div>
    </div>
  </div>
</motion.div>
        {/* Footer - Premium Version */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1.1, duration: 0.6 }}
  className="w-full mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10"
>
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 max-w-6xl mx-auto px-4">
    {/* Copyright */}
    <div className="flex items-center gap-2">
      <span className="text-white/60 text-xs sm:text-sm">© 2026 Athlete.AI</span>
      <span className="text-white/40 text-xs">•</span>
      <span className="text-white/60 text-xs sm:text-sm">Coming Soon</span>
    </div>
    
    {/* Social Links */}
    <div className="flex items-center gap-6 sm:gap-8">
      {/* Instagram */}
      <a 
        href="https://instagram.com/theathleteai" 
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 text-white/70 hover:text-[#00A3FF] transition-all duration-300"
      >
        <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-xs sm:text-sm">@theathleteai</span>
      </a>
      
      {/* TikTok */}
      <a 
        href="https://tiktok.com/@theathleteai" 
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 text-white/70 hover:text-[#00A3FF] transition-all duration-300"
      >
        <FaTiktok className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-xs sm:text-sm">@theathleteai</span>
      </a>
    </div>
    
    {/* Legal Links */}
    <div className="flex items-center gap-3 sm:gap-4">
      <a href="#" className="text-white/50 text-[10px] sm:text-xs hover:text-[#00A3FF] transition-colors">Privacy</a>
      <span className="text-white/30 text-[10px]">•</span>
      <a href="#" className="text-white/50 text-[10px] sm:text-xs hover:text-[#00A3FF] transition-colors">Terms</a>
    </div>
  </div>
</motion.div>

      </div>
    </div>
  );
}

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.04; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.08; transform: translate(-50%, -50%) scale(1.1); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }
`;
document.head.appendChild(styleSheet);

export default App;