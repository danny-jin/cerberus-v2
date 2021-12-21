import React from 'react';

import { CustomSvg } from '../index';
import { SvgProps } from '../../../core/interfaces/svg';

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <CustomSvg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="16" cy="16" r="15" fill="white" stroke="url(#paint0_linear)" strokeWidth="2"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.2496 20.9764V20.9757L10 17.3491L16.2495 25.9999V26L16.2496 26L16.2496 26V25.9999L22.5025 17.3491L16.2496 20.9764Z" fill="#708B96"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.2496 6.00008L16.2496 6V6.00016L22.4983 16.1855L16.2496 13.3932L10 16.1855L16.2495 6.00016V6L16.2496 6.00008ZM16.2495 13.3949L10 16.1855L16.2495 19.8137V19.8137L16.2496 19.8137L16.2496 19.8137V19.8137L22.4983 16.1855L16.2496 13.3949V13.3949L16.2496 13.3949L16.2495 13.3949V13.3949Z" fill="#424242"/>
      <defs>
        <linearGradient id="paint0_linear" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#444243"/>
          <stop offset="1" stopColor="#708B96"/>
        </linearGradient>
      </defs>
    </CustomSvg>
  );
};

export default Icon;
