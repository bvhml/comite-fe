import React from 'react';
import { Button } from '@material-ui/core';

const ConfirmAction = ({ message, confirmAction, cancelAction, confirmText, cancelText }) => {
    return (
        <div className="confirm-action">
            <p className="confirm-action__message">{message}</p>
            <div>
                <Button className="confirm-action__cancel-button" variant="contained" onClick={cancelAction}>{cancelText}</Button>
                <Button className="confirm-action__confirm-button" variant="contained" onClick={confirmAction}>{confirmText}</Button>
            </div>
        </div>
    )
}

export default ConfirmAction;