import React, { Component } from 'react';
import {Paper, Table, TableHead, TableBody, TableCell, TableRow} from "@material-ui/core";
import Advisor from './Advisor';

import { withStyles } from '@material-ui/core/styles/index';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from '@material-ui/icons/FilterList';
import axios from 'axios';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto'
    }
});

class AdvisorsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderBy: {
                name: 'asc',
                languages: 'asc',
                reviews: 'asc',
                status: 'asc'
            },
            // I have simulated this with POSTMAN, however I kept this here, as a backup
            advisors: [
                {
                    id: '0',
                    name: 'AAA',
                    language: 'Greek',
                    reviews: '100',
                    status: 'online'
                },
                {
                    id: '1',
                    name: 'BBB',
                    language: 'Greek',
                    reviews: '115',
                    status: 'offline'
                },
                {
                    id: '2',
                    name: 'CCC',
                    language: 'Greek',
                    reviews: '105',
                    status: 'offline'
                }
            ],
            tableHeadCells: [
                {
                    id: '0',
                    name: 'name'
                },
                {
                    id: '1',
                    name: 'languages'
                },
                {
                    id: '2',
                    name: 'reviews'
                },
                {
                    id: '3',
                    name: 'status'
                }
            ]
        };
        this.onHeaderItemClick = this.onHeaderItemClick.bind(this);
        this.sortTable = this.sortTable.bind(this);
    }

    /**
     * @param {string} sortProperty - The sorting by property that the object should be sorted by
     * @param {string} direction - The direction that the sorting should follow (asc, desc)
     * @returns {any[]}
     */
    sortTable (sortProperty, direction) {
        /**
         * Simple private sorter function. Does not need to polute scope.
         * @param a
         * @param b
         * @returns {number}
         */
        function sorter(a,b) {
            if (a[sortProperty] < b[sortProperty]) {
                return -1;
            }
            if (b[sortProperty] < a[sortProperty]) {
                return 1;
            }
            return 0;
        }

        return direction === 'dec'? this.state.advisors.sort(sorter) :
            this.state.advisors.sort(sorter).reverse();
    }

    /**
     * When an item on the header of the table is clicked, it first clones the object orderBy
     * to avoid any side effects since objects are by reference. Then, it checks what the column
     * was last sorted with (asc, desc) and it calls the function responsible for sorting.
     * @param {event} e
     * @param {string} sortProperty
    */
    onHeaderItemClick (e, sortProperty) {
        const orderByClone = Object.assign({}, this.state.orderBy);
        orderByClone[sortProperty] = this.state.orderBy[sortProperty] === 'asc'? 'dec' : 'asc';
        const direction = this.state.orderBy[sortProperty] === 'asc'? 'dec' : 'asc';

        this.setState({
            ...this.state,
            orderBy: orderByClone,
            advisors: this.sortTable(sortProperty, direction)
        });
    }

    /**
     * Fetches advisors from the endpoint
     * @returns {[]any}
     */
    fetchAdvisors() {
        return axios.get('https://be26ac49-7bfe-4455-bf43-c6c0ef539c97.mock.pstmn.io/advisors');
    }

    /**
     * Use component will mount so the request starts early enough
    */
    componentWillMount() {
        // this is a good case for testing . It's important for the application to test that the user will be able
        // to see something on his screen.
        this.fetchAdvisors().then(s => {
            this.setState({
                ...this.state,
                advisors: s.data.data
            });
        }).catch(err => console.log('There was an error'));
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                {/*This is included for more advanced filtering, etc filter for specific languages*/}
                <Tooltip title="Filter list">
                    <IconButton aria-label="Filter list">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
                <Table className={classes.table}>
                    <TableHead>
                            <TableRow>
                                {
                                    this.state.tableHeadCells.map(cell => (
                                      <TableCell key={cell.id} align="left" onClick={
                                            e => this.onHeaderItemClick(e, cell.name)}>{cell.name}
                                      </TableCell>
                                    ))
                                }
                            </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.advisors.map(advisor => (
                                <Advisor
                                    key={advisor.id}
                                    name={advisor.name}
                                    language={advisor.language}
                                    reviews={advisor.reviews}
                                    status={advisor.status}
                                />
                            ))
                        }
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}
export default withStyles(styles)(AdvisorsTable);