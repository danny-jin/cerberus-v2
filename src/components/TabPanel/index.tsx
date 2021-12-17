import PropTypes from 'prop-types';

function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tab-panel"
      hidden={value !== index}
      id={`simple-tab-panel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className="w-full p-0"
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default TabPanel;
