import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gearImg from '../assets/gear-float.png';
import pistonImg from '../assets/piston-float.png';

const MechanicalBackground = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const { scrollYProgress } = useScroll();

  // Only run parallax on desktop — on Android, firing style mutations on every
  // scroll event (even via framer-motion) causes dropped frames and jank
  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
  }, []);

  // Create different parallax speeds (only used on desktop)
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const r1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const r2 = useTransform(scrollYProgress, [0, 1], [0, -180]);

  return (
    <div className="mechanical-bg-wrapper">
      {/* Background Gear 1 */}
      <motion.div 
        style={isDesktop ? { y: y1, rotate: r1, willChange: 'transform' } : {}}
        className="bg-element gear-1"
      >
        <img src={gearImg} alt="" />
      </motion.div>

      {/* Background Gear 2 */}
      <motion.div 
        style={isDesktop ? { y: y2, rotate: r2, willChange: 'transform' } : {}}
        className="bg-element gear-2"
      >
        <img src={gearImg} alt="" />
      </motion.div>

      {/* Background Piston */}
      <motion.div 
        style={isDesktop ? { y: y2, willChange: 'transform' } : {}}
        className="bg-element piston-1"
      >
        <img src={pistonImg} alt="" />
      </motion.div>

      <div className="bg-overlay-noise"></div>
    </div>
  );
};

export default MechanicalBackground;
