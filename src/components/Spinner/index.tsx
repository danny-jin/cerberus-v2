import { Backdrop, Container } from "@material-ui/core";

import { LoadingIcon } from '../CustomSvg';

function Spinner() {
  return (
    <Backdrop open={true} className="z-50 backdrop-blur-2xl" >
      <Container className="flex justify-center items-center">
        <LoadingIcon className="animate-loading scale-100"/>
      </Container>
    </Backdrop>
  );
}

export default Spinner;
