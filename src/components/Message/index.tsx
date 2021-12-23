import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useDispatch, useSelector } from 'react-redux';

import store, { RootState } from '../../core/store/store';
import { close, handleObsolete } from '../../core/store/slices/messageSlice';

// A component that displays error messages
function Message() {
  const messages = useSelector((state: RootState) => state.message);
  const dispatch = useDispatch();
  // Returns a function that can closes a message
  const handleClose = (message) => {
    return function () {
      dispatch(close(message));
    };
  };
  return (
    <div>
      <div>
        {messages.items.map((message, index) => {
          return (
            <Snackbar open={message.open} key={index} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
              <Alert
                variant="filled"
                icon={false}
                // @ts-ignore
                severity={message.severity}
                onClose={handleClose(message)}
                style={{wordBreak: 'break-word'}}
              >
                <AlertTitle>{message.title}</AlertTitle>
                {message.text}
              </Alert>
            </Snackbar>
          );
        })}
      </div>
    </div>
  );
}

// Invoke repeatedly obsolete messages deletion (should be in slice file but I cannot find a way to access the store from there)
window.setInterval(() => {
  store.dispatch(handleObsolete());
}, 60000);

export default Message;
