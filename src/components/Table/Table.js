import React, { useMemo } from 'react';
import { 
    useTable, 
    useSortBy,
    useGlobalFilter,
    usePagination,
    useRowSelect,
    useColumnOrder,
} from 'react-table';
import { 
    ChevronLeftOutlined,
    ChevronRightOutlined,
    FirstPageOutlined,
    LastPageOutlined,
    FileDownloadOutlined,
    SortOutlined,
    SentimentDissatisfiedOutlined,
} from '@mui/icons-material';
import Loader from 'react-loader-spinner';
import { IconButton } from '@mui/material';
import { GlobalFilter } from './GlobalFilter';
import { ColumnFilter } from './ColumnFilter';
import { COLORS } from '../../constants/colors';
import { convertTime } from '../../utils/utility';
import UserForm from '../../pages/UserAdmin/UserForm';
import UserAction from '../../pages/UserAdmin/UserAction';
import { EXPORT_DATA, SHOW_PHOTO } from '../../constants/urls';
import { GuestAction } from '../../pages/GuestAdmin/GuestAction';
import AppointmentDetail from '../../pages/AppointmentPage/AppointmentDetail';

const Table = props => {
    const { columns, data, loading, fetchUsers, fetchAppointments } = props;
    let pathname = window.location.pathname;

    const defaultColumn = useMemo(() => {
        return {
            Filter: ColumnFilter,
        };
    }, []);

    const actionHooks = hooks => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "action",
                Header: "Action",
                Cell: ({ row }) => {
                    if (pathname === '/guest-list') {
                        return (
                            <GuestAction id={row.values.id} fetchAppointments={fetchAppointments}/>
                        )
                    } 
                    else if (pathname === '/user-list') {
                        return (
                            <UserAction id={row.values.id} fetchUsers={fetchUsers} />
                        )
                    } 
                    else if (pathname === '/appointment-history') {
                        return (
                            <AppointmentDetail id={row.values.id} /> 
                        )
                    }
                }
            },
        ]);
    };

    const userHooks = hooks => {
        if (pathname === "/user-list") {
            hooks.visibleColumns.push((columns) => [
                ...columns,
                {
                    id: "user",
                    Header: "User",
                    Cell: ({ row }) => {
                        return (
                            <div className="flex flex-row items-center gap-4">
                                <img 
                                    alt="img"
                                    src={SHOW_PHOTO(row.values.photo)}
                                    className="w-10 h-10 rounded-full" 
                                />
                                <p className="font-semibold text-gray-700">{ row.values.name }</p>
                            </div>
                        );
                    },
                },
            ]);
        }
    };

    const timeHooks = hooks => {
        if (pathname === '/appointment-history' || pathname === '/guest-list') {
            hooks.visibleColumns.push((columns) => [
                {
                    id: "time",
                    Header: "Time",
                    Cell: ({ row }) => <p>{ row.values.date_time[1] } WIB</p>
                },
                {
                    id: "date",
                    Header: "Date",
                    Cell: ({ row }) => {
                        return (
                            <div className="flex flex-col">
                                <p className="font-medium text-gray-700">{ row.values.date_time[0] }</p>
                                <p className="text-xs text-gray-400">
                                    { convertTime(row.values.date_time[0], row.values.date_time[1]) }
                                </p>
                            </div>
                        )
                    }
                },
                ...columns,
            ]);
        }
    };

    const changePage = (e) => {
        const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
        gotoPage(pageNumber);
    };

    const hideColumns = () => {
        if (pathname === '/user-list') {
            return ['name', 'photo'];
        } else if (pathname === '/guest-list') {
            return ['id', 'purpose', 'notes', 'status', 'date_time'];
        } else if (pathname === '/appointment-history') {
            return ['id', 'purpose', 'notes', 'date_time'];
        } else {
            return [''];
        }
    };

    const customColumnOrder = () => {
        if (pathname === '/appointment-history') {
            return ['time', 'date', 'host', 'guest', 'status'];
        } else if (pathname === '/user-list') {
            return ['id', 'user', 'email', 'role'];
        }
    };

    const tableInstance = useTable({
        columns,
        data,
        defaultColumn,    
        initialState: {
            sortBy: [{ id: 'id', desc: true }],
            hiddenColumns: hideColumns(),
            columnOrder: customColumnOrder(),
        }
    },
        userHooks,
        timeHooks,
        actionHooks,
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        useColumnOrder,
    );

    const { 
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        prepareRow,
        state,
        setGlobalFilter,
    } = tableInstance;

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <div className="overflow-x-auto w-full shadow-mobile rounded-lg">
            <div className="rounded-lg bg-white border-2 border-grey-400 z-10 inline-block min-w-full">
                <div className="flex flex-row w-full justify-between items-center px-6 py-4 sticky top-0 bg-white border-b border-gray-100 rounded-t-lg">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    <div>
                        {window.location.pathname === "/user-list" && (
                            <UserForm fetchUsers={fetchUsers} />
                        )}
                        {window.location.pathname === "/appointment-history" && (
                            <button
                                className="primary-btn"
                                onClick={() => window.open(EXPORT_DATA)}
                            >
                                <FileDownloadOutlined />
                                Export
                            </button>
                        )}
                    </div>
                </div>
                {loading ? (
                    <span className="bg-white p-6 text-gray-300 flex flex-col justify-center items-center">
                        <Loader
                            type="Oval"
                            radius={18}
                            color={COLORS.primary}
                            secondaryColor={COLORS.accent}
                            height={24}
                            width={24}
                        />
                    </span>
                ) : page.length !== 0 ? (
                    <table
                        className="w-full overflow-x-scroll overflow-y-hidden border-b border-gray-100 rounded-lg"
                        {...getTableProps()}
                    >
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr
                                    className="bg-gray-50 h-14 border-b border-gray-100 text-primary"
                                    {...headerGroup.getHeaderGroupProps()}
                                >
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            className="px-6 text-sm font-semibold text-primary"
                                            {...column.getHeaderProps(
                                                column.getSortByToggleProps()
                                            )}
                                        >
                                            <div className="flex flex-row items-center gap-4">
                                                {column.render("Header")}
                                                <span>
                                                    {column.isSorted ? (
                                                        column.iSortedDesc ? (
                                                            <SortOutlined />
                                                        ) : (
                                                            <SortOutlined />
                                                        )
                                                    ) : (
                                                        ""
                                                    )}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody
                            className="text-sm text-gray-900 bg-white whitespace-nowrap"
                            {...getTableBodyProps()}
                        >
                            {page.map((row) => {
                                prepareRow(row);
                                return window.location.pathname === "/guest-list" ? (
                                    row.values.status === "waiting" && (
                                        <tr
                                            {...row.getRowProps()}
                                            className="h-14 border-b border-gray-100 text-gray-700 whitespace-nowrap"
                                        >
                                            {row.cells.map((cell) => {
                                                return (
                                                    <td
                                                        className="px-6 text-grey-700"
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.render(
                                                            "Cell"
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    )
                                ) : (
                                    <tr
                                        className="h-14 border-b border-gray-100"
                                        {...row.getRowProps()}
                                    >
                                        {row.cells.map((cell) => {
                                            return (
                                                <td
                                                    className="px-6"
                                                    {...cell.getCellProps()}
                                                >
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="bg-white p-6 text-gray-300 flex flex-col justify-center items-center">
                        <SentimentDissatisfiedOutlined sx={{ fontSize: "6rem", color: "#E5E7EB" }} />
                        <p>Oops, there's no data here</p>
                    </div>
                )}
                <div className="flex flex-row justify-between items-center h-14 px-6 py-4 border-t border-gray-100 text-gray-700 rounded-b-lg bg-white whitespace-nowrap">
                    <div>
                        Displaying <strong>{ data.length }</strong> of{" "}
                        <strong>{ data.length }</strong> data - Page{" "}
                        <strong>{ pageIndex + 1 }</strong> of{" "}
                        <strong>{ pageOptions.length }</strong>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-4">
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={changePage}
                            className="block w-16 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="block w-20 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                            {[10, 25, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                        <div className="flex flex-row gap-2">
                            <IconButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                                <FirstPageOutlined />
                            </IconButton>
                            <IconButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                                <ChevronLeftOutlined />
                            </IconButton>
                            <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
                                <ChevronRightOutlined />
                            </IconButton>
                            <IconButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                                <LastPageOutlined />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;