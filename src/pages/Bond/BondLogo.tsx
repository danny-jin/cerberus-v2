import { SvgIcon } from '@material-ui/core';

function BondLogo({bond}) {
  let viewBox = '0 0 32 32';
  let style = {height: '32px', width: '32px'};

  // Need more space if its an LP token
  if (bond.isLp) {
    viewBox = '0 0 64 32';
    style = {height: '32px', width: '62px'};
  }
  return (
    <div className="flex justify-center items-center w-70">
      <SvgIcon component={bond.bondIconSvg} viewBox={viewBox} style={style}/>
    </div>
  );
}

export default BondLogo;
