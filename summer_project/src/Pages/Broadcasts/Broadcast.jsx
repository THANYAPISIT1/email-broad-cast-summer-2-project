import { useEffect } from 'react';
import { formatDate } from '../../utils/date';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchBroadcasts,
  fetchFilterTags,
  setSelectedTags,
  setSelectedStatus,
  setSelectedFilter,
  setSelectedDateRange,
  setCurrentPage,
  selectBroadcasts,
  selectBroadcastLoading,
  selectCurrentPage,
  selectTotalPages,
  selectFilters,
} from '../../store/slices/broadcastSlice';
import Sidebar from '../../Components/Layouts/Sidebar';
import TopNav from '../../Components/Layouts/TopNav';
import { FaFileAlt } from "react-icons/fa";
import Filter from '../../Components/BCList/Filter';
import { Link } from 'react-router-dom';
import { BsThreeDots } from "react-icons/bs";
import { Pagination } from "@nextui-org/react";
import { Button } from "@nextui-org/button";


const Broadcast = () => {
    const dispatch = useAppDispatch();
    const broadcasts = useAppSelector(selectBroadcasts);
    const loading = useAppSelector(selectBroadcastLoading);
    const currentPage = useAppSelector(selectCurrentPage);
    const totalPages = useAppSelector(selectTotalPages);
    const filters = useAppSelector(selectFilters);

    useEffect(() => {
        dispatch(fetchFilterTags());
    }, [dispatch]);

    useEffect(() => {
        const params = {
            page: currentPage,
            status: filters.selectedStatus?.value || null,
            dateRange: filters.selectedDateRange,
            tags: filters.selectedTags,
            filter: filters.selectedFilter?.value || null,
        };
        
        dispatch(fetchBroadcasts(params));
    }, [dispatch, currentPage, filters]);



    const handlePaginationChange = (page) => {
        dispatch(setCurrentPage(page));
    };

    const handleStatusChange = (status) => {
        dispatch(setSelectedStatus(status));
        dispatch(setCurrentPage(1));
    };

    const handleDateRangeChange = (dateRange) => {
        dispatch(setSelectedDateRange(dateRange));
        dispatch(setCurrentPage(1));
    };

    const handleTagChange = (tags) => {
        dispatch(setSelectedTags(tags));
        dispatch(setCurrentPage(1));
    };

    const handleFilterChange = (filter) => {
        dispatch(setSelectedFilter(filter));
        dispatch(setCurrentPage(1));
    };

    return (
        <div className='relative'>
            <TopNav />
            <Sidebar />  
            <div className='mt-16'>
                <section className="ml-64">
                    <header className='flex justify-between static items-center text-center'>
                        <div className="text-xl p-8 font-bold">Broadcast</div>
                        <Link to='/create-broadcast' className='mt-4'>
                            {/* <Createbtn className='mr-4 border mt-8 h-10 items-center w-40 p-2 rounded-md text-blue-600 hover:bg-blue-500 hover:text-white' /> */}
                            <Button color="primary" variant="ghost" className="mr-4">
                                Add new customer
                            </Button>
                        </Link>
                    </header>
                    <hr />
                    <Filter onStatusChange={handleStatusChange}
                            onDateRangeChange={(startDate, endDate) => handleDateRangeChange(startDate, endDate)}
                            onTagChange={handleTagChange}
                            onFilterChange={handleFilterChange} 
/>

                    <hr />

                    {loading ? (
                        <></>
                    ) : (
                        broadcasts.map(broadcast => (
                            <div key={broadcast.BID} className="mx-4 my-4">
                                <div className="flex justify-between mx-auto p-4 border border-gray-300 rounded-md">
                                    <div className='flex'>
                                        <FaFileAlt className="h-8 my-3 ml-2 mr-4"/>
                                        <div>
                                            <h2 className="font-bold text-violet-700">{broadcast.BName}</h2>
                                            <p>
                                                Tag: {broadcast.BTag}<br />
                                                Created by: {broadcast.BUpdate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='absolute left-1/2'>
                                        <span className='bg-gray-200 py-2 px-3 rounded-lg text-xs'>{broadcast.BStatus}</span>
                                    </div>
                                    <div>
                                        {broadcast.BStatus === 'Draft' || broadcast.BStatus === 'Schedule' ? (
                                            <button className="rounded-md h-10 text-sm p-2 bg-teal-500 hover:bg-teal-700 text-white items-center">
                                                Can edit
                                            </button>
                                        ) : (
                                            <button className="rounded-md h-10 text-sm p-2 bg-teal-500 hover:bg-teal-700 text-white items-center">
                                                Message has been sent 
                                            </button>
                                        )}
                                        <button className="rounded-md h-10 text-sm p-2 border-2 mx-2 items-center">
                                            <BsThreeDots />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>
                <footer className='ml-64 flex justify-center mt-8 my-8'>
                    <Pagination
                        isCompact 
                        showControls 
                        className=''
                        total={totalPages}
                        page={currentPage}
                        onChange={handlePaginationChange}
                    />
                </footer>

            </div>
        </div>
    );
};

export default Broadcast;
