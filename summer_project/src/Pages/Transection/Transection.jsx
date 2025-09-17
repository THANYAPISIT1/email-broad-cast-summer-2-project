import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';
import Sidebar from '../../Components/Layouts/Sidebar';
import TopNav from '../../Components/Layouts/TopNav';
import { Pagination } from "@nextui-org/react";

const Transection = () => {
    const [activity, setActivity] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchActivity = async (page) => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/activity-log?page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const data = response.data;
            setActivity(data.activityLogs);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching customers:', error);
            alert(`Error fetching customers: ${error.response?.data?.message || error.message}`);
        }
    };

    useEffect(() => {
        fetchActivity(currentPage);
    }, [currentPage]);

    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className='relative'>
            <TopNav />
            <Sidebar />
            <div className='mt-16'>
                <section className="ml-64">
                    <header className='static'>
                        <div className="text-xl p-8 font-bold">Transactions</div>
                    </header>
                    <hr />
                    <div className='p-8'>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full table-fixed text-sm text-left rtl:text-right text-gray-800 dark:text-gray-700">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-center">BroadcastName</th>
                                        <th className="px-6 py-3 text-center">Email</th>
                                        <th className="px-6 py-3 text-center">Level</th>
                                        <th className="px-6 py-3 text-center">Template</th>
                                        <th className="px-6 py-3 text-center">Processed At</th>
                                        {/* <th className="px-6 py-3 text-right">Processed At</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.length > 0 ? (
                                        activity.map((act, index) => (
                                            <tr key={index} className="text-center bg-white border-b dark:bg-gray-200 dark:border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-300">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-800">{act.BName}</td>
                                                <td className="px-6 py-4 ">{act.CusEmail}</td>
                                                <td className="px-6 py-4 ">{act.CusLevel}</td>
                                                <td className="px-6 py-4 ">{act.TName}</td>
                                                <td className="px-6 py-4 ">{act.BCDatetime}</td>
                                                {/* <td className="px-6 py-4 text-right">{act.ProcessedAt}</td> */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
                <footer className='ml-64 flex justify-center mt-8 my-8'>
                    <Pagination
                        isCompact
                        showControls
                        total={totalPages}
                        page={currentPage}
                        onChange={handlePaginationChange}
                    />
                </footer>
            </div>
        </div>
    );
};

export default Transection;
