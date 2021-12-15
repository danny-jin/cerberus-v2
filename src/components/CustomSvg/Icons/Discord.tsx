import React from 'react';

import { CustomSvg } from '../index';
import { SvgProps } from '../../../core/interfaces/svg';

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <CustomSvg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" { ...props }>
      <path d="M17.2286 4.63925C15.4971 3.24782 12.7593 3.01211 12.6436 3.00211C12.4607 2.98639 12.2871 3.08997 12.2121 3.25711C12.2093 3.26282 12.0564 3.70639 11.9086 4.13425C13.9207 4.48639 15.2879 5.26782 15.3607 5.31068C15.7021 5.50925 15.8164 5.94711 15.6171 6.28782C15.485 6.51496 15.2457 6.64211 15 6.64211C14.8779 6.64211 14.755 6.61139 14.6421 6.54568C14.6221 6.53354 12.6164 5.39211 10.0014 5.39211C7.38571 5.39211 5.37929 6.53425 5.35929 6.54568C5.01857 6.74354 4.58143 6.62711 4.38357 6.28568C4.18571 5.94568 4.30071 5.50925 4.64071 5.31068C4.71357 5.26782 6.08571 4.48354 8.10357 4.13211C7.94786 3.69925 7.79071 3.26282 7.78786 3.25711C7.71286 3.08925 7.53929 2.98354 7.35643 3.00211C7.24071 3.01139 4.50286 3.24711 2.74857 4.65782C1.83143 5.50497 0 10.4578 0 14.74C0 14.8157 0.0192857 14.8893 0.0571429 14.955C1.32214 17.1764 4.77071 17.7578 5.55643 17.7828C5.56143 17.7835 5.56571 17.7835 5.57 17.7835C5.70857 17.7835 5.83929 17.7171 5.92143 17.605L6.77143 16.4535C4.90714 16.0043 3.92143 15.2978 3.86214 15.2542C3.545 15.0207 3.47643 14.5735 3.71 14.2557C3.94286 13.9393 4.38857 13.8693 4.70571 14.1014C4.73214 14.1185 6.55143 15.3921 10 15.3921C13.4621 15.3921 15.2764 14.1135 15.2943 14.1007C15.6114 13.8707 16.0586 13.94 16.2907 14.2585C16.5221 14.5757 16.455 15.02 16.1393 15.2528C16.08 15.2964 15.0993 16.0014 13.2393 16.4507L14.0786 17.6042C14.1607 17.7171 14.2914 17.7828 14.43 17.7828C14.435 17.7828 14.4393 17.7828 14.4436 17.7821C15.23 17.7571 18.6786 17.1757 19.9429 14.9542C19.9807 14.8885 20 14.815 20 14.7393C20 10.4578 18.1686 5.50497 17.2286 4.63925ZM7.14286 13.2493C6.35357 13.2493 5.71429 12.45 5.71429 11.4635C5.71429 10.4771 6.35357 9.67782 7.14286 9.67782C7.93214 9.67782 8.57143 10.4771 8.57143 11.4635C8.57143 12.45 7.93214 13.2493 7.14286 13.2493ZM12.8571 13.2493C12.0679 13.2493 11.4286 12.45 11.4286 11.4635C11.4286 10.4771 12.0679 9.67782 12.8571 9.67782C13.6464 9.67782 14.2857 10.4771 14.2857 11.4635C14.2857 12.45 13.6464 13.2493 12.8571 13.2493Z"/>
    </CustomSvg>

  );
};

export default Icon;
