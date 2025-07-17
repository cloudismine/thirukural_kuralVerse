import React from 'react';

const ThiruvalluvarImage = ({ 
  size = 'md', 
  className = '', 
  style = 'portrait',
  showBorder = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  const baseClasses = `${sizeClasses[size]} ${showBorder ? 'border-2 border-sandalwood-500 shadow-md' : ''} ${className}`;

  if (style === 'icon') {
    return (
      <div className={`${baseClasses} bg-saffron-600 rounded-full flex items-center justify-center`}>
        <span className="text-white font-bold font-catamaran-bold" style={{ fontSize: size === 'sm' ? '0.6rem' : size === 'md' ? '0.8rem' : '1rem' }}>
          வள்
        </span>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} bg-manuscript-50 rounded-lg overflow-hidden`}>
      {/* Placeholder for Thiruvalluvar image */}
      <img 
        src="/images/thiruvalluvar.jpg" 
        alt="Thiruvalluvar"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to icon style if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div 
        className="w-full h-full bg-saffron-600 rounded-lg flex items-center justify-center hidden"
        style={{ display: 'none' }}
      >
        <span className="text-white font-bold font-catamaran-bold" style={{ fontSize: size === 'sm' ? '0.6rem' : size === 'md' ? '0.8rem' : '1rem' }}>
          வள்
        </span>
      </div>
    </div>
  );
};

export default ThiruvalluvarImage;
