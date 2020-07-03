import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import * as LinkRouter from "react-router-dom";
import Link from '@material-ui/core/Link';

export default function NavBar(props){
    const {classes} = props;


    return (
        <Grid item container style={{backgroundColor:'transparent'}} justify="space-evenly">
            <Grid item xs={false} md={false} lg={false} style={{backgroundColor:'transparent'}}>
                <LinkRouter.Link to="/me" component={Link} className={classes.NavLink}>
                    <Typography component="h6" variant="h6">
                        Me
                    </Typography>
                </LinkRouter.Link>
            </Grid>
            <Grid item xs={false} md={false} lg={false} style={{backgroundColor:'transparent'}}>
                <LinkRouter.Link to="/me" component={Link} className={classes.NavLink}>
                    <Typography component="h6" variant="h6">
                        Explore
                    </Typography>
                </LinkRouter.Link>
            </Grid>
            <Grid item xs={false} md={false} lg={false} style={{backgroundColor:'transparent'}}>
                <LinkRouter.Link to="/" component={Link} className={classes.NavLink}>
                    <Typography component="h6" variant="h6">
                        Messages
                    </Typography>
                </LinkRouter.Link>
            </Grid>
            <Grid item xs={false} md={false} lg={false} style={{backgroundColor:'transparent'}}>
                <LinkRouter.Link to="/" component={Link} className={classes.NavLink}>
                    <Typography component="h6" variant="h6">
                        Contacts
                    </Typography>
                </LinkRouter.Link>
            </Grid>
            
        </Grid>
    );




}