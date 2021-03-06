import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export const GlobalFilter = ({ filter, setFilter }) => {
    const [value, setValue] = useState(filter);
    
    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined); 
    }, 1000);

    const getPlaceholder = () => {
        let pathname = window.location.pathname;
        let placeholder = 'Search ';

        if (pathname === '/appointment-history' || pathname === '/guest-list') {
            return placeholder += 'appointments';
        } else if (pathname === '/user-list') {
            return placeholder += 'user';
        }
    };

    return (
        <div className="flex rounded-lg shadow-sm w-60">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm">
                <SearchRoundedIcon />
            </span>
            <input
                type="search"
                name="search-host"
                id="search-host"
                className="bg-gray-50 text-gray-700 focus:ring-primary focus:border-primary flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 placeholder-gray-300"
                placeholder={getPlaceholder()}
                value={value || ''}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                
            />
        </div>
    )
};