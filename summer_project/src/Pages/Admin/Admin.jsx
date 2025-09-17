import { Link } from "react-router-dom";
import Select from "react-select";
import { useState, useEffect } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { API_BASE_URL } from '../../utils/api';
import TopNav from "../../Components/Layouts/TopNav";
import Sidebar from "../../Components/Layouts/Sidebar";
import axios from "axios";

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async (page) => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/admins?page=${page}`, {
          headers: {
            'authorization': `Bearer ${authToken}`
          }
        });
        const data = response.data;

        setAdmins(data.admin);
        setCurrentPage(page);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError('Failed to fetch admins');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
    }, [currentPage]);

  return (
    <div>
            <TopNav />
            <Sidebar />
            <div className='ml-64 mt-16 py-3'>
                <header className="flex justify-between items-center bg-white text-black text-3xl font-bold pl-8 px-2 py-4 mb-8 border-b border-gray-200">
                    <h2>Admin</h2>
                    <Link to="/AddNewAdmin">
                        <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                            Add new Admin
                        </button>
                    </Link>
                </header>

                <div>
                    {admins.map(admin => (
                        <div key={admin.AID} className='border-b rounded-xl border-gray-700 flex justify-between items-center px-4 py-2 ml-6 mr-16'>
                            <div className='flex'>
                                <div>
                                    <IoPersonOutline className='text-6xl' />
                                </div>
                                <div className='pl-5 pt-2'>
                                    <div className='flex'>
                                        <p className='font-medium font-sans text-xl rounded pl-4 pr-2 content-center'>{admin.AUsername}</p>
                                    </div>
                                    <div className='flex font-medium font-sans text-sm rounded py-0.5 px-4 mr-1/2 pb-2.5'>
                                        <h4>Email:</h4>
                                        <p className='font-medium font-sans text-sm rounded pl-1'>{admin.AEmail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
  );
};

export default Admin;