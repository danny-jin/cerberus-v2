import styled from 'styled-components';
import { space } from 'styled-system';

import { SvgProps } from '../../core/interfaces/svg';
import { getThemeValue } from '../../core/utils/theme';

export const CustomSvg = styled.svg<SvgProps>`
  fill: ${({theme, color}) => getThemeValue(`colors.${color}`, color)(theme)};
  flex-shrink: 0;
  ${space}
`;

export { default as LogoIcon } from './Icons/Logo';
export { default as DashboardIcon } from './Icons/Dashboard';
export { default as StakeIcon } from './Icons/Stake';
export { default as BondIcon } from './Icons/Bond';
export { default as CalculatorIcon } from './Icons/Calculator';
export { default as DocsIcon } from './Icons/Docs';
export { default as MediumIcon } from './Icons/Medium';
export { default as TwitterIcon } from './Icons/Twitter';
export { default as DiscordIcon } from './Icons/Discord';
export { default as CollapseIcon } from './Icons/Collapse';
export { default as GovernanceIcon } from './Icons/Governance';
export { default as InfoIcon } from './Icons/Info';
export { default as ExpandIcon } from './Icons/Expand';
export { default as CloseIcon } from './Icons/Close';
export { default as ArrowUpIcon } from './Icons/ArrowUp';
export { default as CaretDownIcon } from './Icons/CaretDown';
export { default as DogWethIcon } from './Icons/DogWeth';
export { default as ShibaIcon } from './Icons/Shiba';
export { default as WethIcon } from './Icons/Weth';
export { default as FlokiIcon } from './Icons/Floki';
export { default as SettingIcon } from './Icons/Setting';
export { default as LoadingIcon } from './Icons/Loading';
