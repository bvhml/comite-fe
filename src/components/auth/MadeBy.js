import React from 'react';
import Typography from '@material-ui/core/Typography';

export default ({ name }) => {

return(
<div>
    <Typography variant="h5" gutterBottom marked="center" align="center" style={{margin:'30px 0px 0px 0px'}}>
    Made by Victor Morales 
    </Typography>
    <Typography variant="body1" gutterBottom marked="center" align="center">
    {name}!
    </Typography>

</div>
)
};
