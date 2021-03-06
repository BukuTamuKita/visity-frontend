import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { getToken } from '../../utils/auth';
import { convertTime } from '../../utils/utility';
import { SHOW_USERS, SHOW_PHOTO } from '../../constants/urls';

const HostAgenda = props => {
    const { display, appointment, filteredHost } = props;
    const [users, setUsers] = useState(null);
    
    useEffect(() => {
        axios
			.get(SHOW_USERS, {
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then(res => {
				setUsers(res.data.data);
			})
			.catch(err => console.log(err));
        
        return () => {
            setUsers({});
        }
    }, []);

    const getTodayAppointment = (date, time) => {
        const day = 24 * 60 * 60 * 1000;
        date = date.substr(4, date.length).trim();
        let elapsed = +new Date(`${date} ${time}`) - new Date().getTime();

        if (Math.abs(elapsed) < day) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className="flex-initial">
            <div className="flex flex-col gap-4">
                {display ? (
                    <div className="xl:p-6 p-4 flex-col bg-white rounded-lg border-grey-400 xl:shadow-mobile border-2 mb-2 w-full lg:w-80">
                        <p className="xl:text-xl text-primary font-bold xl:mb-8 mb-2 text-xl">
                            Meeting Information
                        </p>
                        <div className="flex flex-col mb-2 divide-y-2 divide-solid divide-gray-100">
                            <div className="flex flex-row items-center gap-4 mb-4">
                                {users.map((user, index) => 
                                    filteredHost.name === user.name && (
                                        <div key={index}>
                                            <img
                                                src={SHOW_PHOTO(user.photo)}
                                                alt="Host"
                                                className="w-12 h-12 rounded-full"
                                            />
                                        </div>
                                    )
                                )}
                                <div className="flex flex-col border-grey-400">
                                    <p className="xl:text-lg font-bold mb-1 text-base">
                                        {filteredHost.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {filteredHost.position}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 justify-between pt-2 max-h-56 md:max-h-72 overflow-y-auto">
                                {appointment.length !== 0 ? (
                                    appointment.map((data, index) => {
                                        return getTodayAppointment(data.date_time[0], data.date_time[1]) && (
                                            <div className="flex flex-col" key={index}>
                                                <div className="flex flex-row justify-between gap-6">
                                                    <p className="font-semibold text-base">
                                                        {data.guest.name}
                                                    </p>
                                                    <p className="text-base whitespace-nowrap">
                                                        { convertTime(data.date_time[0], data.date_time[1]) }
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }).reverse()
                                ) : (
                                    <p className="text-center text-gray-700">
                                        No appointments yet
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 rounded-lg flex flex-col justify-center items-center bg-white border-2 border-grey-400 lg:shadow-mobile text-grey-800">
                        <p className="font-semibold text-sm">
                            No Host Selected
                        </p>
                        <p className="text-xs">Please find your host</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostAgenda;