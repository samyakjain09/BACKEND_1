import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-[#161b26] border border-white/5 rounded-2xl rounded-tl-none w-fit shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex gap-1.5 items-center">
        {/* Dot 1 */}
        <div 
          className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-typing-dot" 
          style={{ animationDelay: '0s' }}
        ></div>
        {/* Dot 2 */}
        <div 
          className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-typing-dot" 
          style={{ animationDelay: '0.2s' }}
        ></div>
        {/* Dot 3 */}
        <div 
          className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-typing-dot" 
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
