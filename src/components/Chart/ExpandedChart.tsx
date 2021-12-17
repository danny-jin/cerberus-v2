import { ResponsiveContainer } from 'recharts';
import { Box, Backdrop, Modal, Paper, SvgIcon, Typography, Fade } from '@material-ui/core';

import InfoTooltip from '../InfoTooltip';
import { CloseIcon } from '../CustomSvg';
import { ExpandedChartProps } from '../../core/interfaces/chart';
import React from 'react';

const ExpandedChart = ({open, handleClose, renderChart, data, infoTooltipMessage, headerText, headerSubText, runwayExtraInfo,}: ExpandedChartProps) => {

  return (
    <Modal open={open} onClose={handleClose}>
      <Backdrop open={true}>
        <Fade in={true}>
          <Paper className="bg-black rounded-xl border-goldsand border-3 w-11/12 lg:max-w-800 py-20">
            <div className="text-white px-20 mb-20">
              <Box className="flex justify-between items-center">
                <Box className="flex items-center font-normal truncate font-normal mr-10">
                  <Typography variant="h6" className="font-normal mr-10">
                    {headerText}
                  </Typography>
                  <Typography variant="h6" className="cursor-pointer">
                    <InfoTooltip message={infoTooltipMessage}/>
                  </Typography>
                </Box>
                <Box className="flex justify-end ml-5">
                  <Typography variant="h6" className="cursor-pointer">
                    <CloseIcon width="20px" fill="white" onClick={handleClose}/>
                  </Typography>
                </Box>
              </Box>
              <Box display="flex">
                <Typography variant="h5" color="primary" className="font-semibold mr-5">
                  {headerSubText}
                </Typography>
                {runwayExtraInfo}
                <Typography variant="h5" color="primary" className="font-normal">
                  Today
                </Typography>
              </Box>
            </div>

            <Box className="px-10 w-full min-h-260 min-w-300">
              {data && data.length > 0 && (
                <ResponsiveContainer className="min-w-300 h-260">
                  {renderChart}
                </ResponsiveContainer>
              )}
            </Box>
            <Box className="flex w-full px-20">
              <Typography variant="h6" color="primary">{infoTooltipMessage}</Typography>
            </Box>
          </Paper>
        </Fade>
      </Backdrop>
    </Modal>
  );
}

export default ExpandedChart;
