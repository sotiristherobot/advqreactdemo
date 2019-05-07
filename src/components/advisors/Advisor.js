import React, {Component} from "react";
import {TableCell, TableRow} from "@material-ui/core";

class Advisor extends Component {
    constructor(props) {
        super(props);
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
                    {this.props.status}
                </TableCell>
            </TableRow>
        )
    }
}
export default Advisor