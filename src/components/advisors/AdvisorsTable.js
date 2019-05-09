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
        margin: theme.spacing.unit * 3,
        overflowX: 'auto',
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
            filteredAdvisors: undefined,
            filter: false,
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
        this.onFilterButtonClick = this.onFilterButtonClick.bind(this);
        this.renderAdvisors = this.renderAdvisors.bind(this);
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
        const arrayToSort = this.state.filter? this.state.filteredAdvisors : this.state.advisors;

        return direction === 'dec'? arrayToSort.sort(sorter) :
            arrayToSort.sort(sorter).reverse();
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
     * Click handler for the filter icon. At the momment is hardcoded to filter only based on advisors who
     * speak German
    */
    onFilterButtonClick() {
        let {filter} = this.state;

        filter = !filter;

        this.setState({
            ...this.state,
            filteredAdvisors: filter &&
                this.state.advisors.filter(v => v.language.includes('German')) ||
                undefined,
            filter
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

    /**
     * Creates and returns an array of <Advisors />
     * @returns {[]advisors}
    */
    renderAdvisors(advisors) {
        return advisors.map(advisor => (
            <Advisor
                key={advisor.id}
                name={advisor.name}
                language={advisor.language}
                reviews={advisor.reviews}
                status={advisor.status}
            />
        ));
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                {/*This is included for more advanced filtering, etc filter for specific languages*/}
                <Tooltip title="Filter list">
                    <IconButton aria-label="Filter list" onClick={this.onFilterButtonClick}>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
                <Table>
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
                            this.state.filter?
                                this.renderAdvisors(this.state.filteredAdvisors):
                                this.renderAdvisors(this.state.advisors)
                        }
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}
export default withStyles(styles)(AdvisorsTable);