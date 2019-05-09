import React, {Component} from "react";
import {TableCell, TableRow, withStyles} from "@material-ui/core";
import CheckCircle from '@material-ui/icons/CheckCircle';

const styles = {
    onlineIcon: {
      color: "green"
    },
    offlineIcon: {
        color: "gray"
    }
};

class Advisor extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * Checks if user has status online/offline and returns the appropriate color for the icon
     * @returns {CheckCircle}
    */
    renderStatusIcon() {
        const { classes } = this.props;
        return this.props.status === 'online'?
            <CheckCircle className={classes.onlineIcon}/>:
            <CheckCircle className={classes.offlineIcon}/>
    }

    render() {
        return(
            <TableRow
                key={this.props.id}
            >
                <TableCell>
                    {this.props.name}
                </TableCell>
                <TableCell align="left">
                    {this.props.language}
                </TableCell>
                <TableCell align="left">
                    {this.props.reviews}
                </TableCell>
                <TableCell align="left">
                    {
                        this.renderStatusIcon()
                    }
                </TableCell>
            </TableRow>
        )
    }
}
export default withStyles(styles)(Advisor);