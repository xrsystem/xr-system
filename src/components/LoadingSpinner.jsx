import { motion } from 'motion/react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full"
      />
    </div>
  );
}
