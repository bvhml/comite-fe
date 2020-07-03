import React from 'react';
import Button from '@material-ui/core/Button';

export default function ButtonSubmit(props){
        const {classes} = props;
        return(
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                >
                Sign In
            </Button>
        )
    
}
