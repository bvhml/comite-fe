import React from 'react';
import { Button } from '@material-ui/core';

const ConfirmAction = ({ message, confirmAction, cancelAction, confirmText, cancelText }) => {
    return (
        <div className="confirm-action">
            <p className="confirm-action__message">{message}</p>
            <div className="confirm-action__buttons">
                <Button className="confirm-action__buttons--cancel" variant="contained" onClick={cancelAction}>{cancelText}</Button>
                <Button className="confirm-action__buttons--confirm" variant="contained" onClick={confirmAction}>{confirmText}</Button>
            </div>
        </div>
    )
}

export default ConfirmAction;