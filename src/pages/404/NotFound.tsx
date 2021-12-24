import { Typography } from '@material-ui/core';

import CerberusLogo from '../../assets/images/cerberus_gold_transparent.png';

export default function NotFound() {
  return (
    <div className="flex justify-center items-center">
      <div>
        <a href="https://cerberusdao.finance" target="_blank">
          <img className="my-auto" src={CerberusLogo} alt="CerberusDAO"/>
        </a>
        <Typography className="text-10 text-white font-bold my-15">Page not found</Typography>
      </div>
    </div>
  );
}
