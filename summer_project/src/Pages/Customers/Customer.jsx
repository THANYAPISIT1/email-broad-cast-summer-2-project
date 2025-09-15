import { Link } from "react-router-dom";
import Select from "react-select";
import { useState, useEffect } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { API_BASE_URL } from '../../utils/api';
import TopNav from "../../Components/Layouts/TopNav";
import Sidebar from "../../Components/Layouts/Sidebar";
import { Button } from "@nextui-org/button";
import axios from "axios";
import { Pagination } from "@nextui-org/react"; 

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]); 

  const fetchCustomers = async (page, tags) => {
    try {
      const authToken = localStorage.getItem('token');
      const tagsQuery = tags.length > 0 ? `&selectedLevel=${tags.map(tag => tag.value).join(',')}` : '';
      const response = await axios.get(`${API_BASE_URL}/customers?page=${page}${tagsQuery}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = response.data;
      setCustomers(data.customers);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert(`Error fetching customers: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage, selectedTags);
  }, [currentPage, selectedTags]); // Add selectedTags as a dependency

  const customStyles = {
    control: (base) => ({
      ...base,
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      minHeight: "calc(2.25rem + 2px)",
      boxShadow: "none",
    }),
  };

  const tags = [
    { label: "Silver", value: "Silver" },
    { label: "Gold", value: "Gold" },
    { label: "Platinum", value: "Platinum" },
    { label: "Diamond", value: "Diamond" },
  ];

  const levelColors = {
    Silver: "bg-gradient-to-b from-customGray to-customGray2",
    Gold: "bg-gradient-to-b from-customYellow via-customYellow2 to-customYellow3",
    Platinum: "bg-gradient-to-b from-customPlatinum to-customPlatinum2",
    Diamond: "bg-gradient-to-r from-customDiamond via-customDiamond2 to-customDiamond3",
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
    setCurrentPage(1);
  };

  return (
    <div>
      <TopNav />
      <Sidebar />
      <div className="ml-64 mt-16 py-3">
        <header className="flex justify-between items-center font-bold bg-white pl-8 px-2 py-4 mb-4 border-b border-gray-200">
          <h2 className="text-black text-xl">Customers</h2>
          <Link to="/customer/add">
            <Button color="primary" variant="ghost">
              Add new customer
            </Button>
          </Link>
        </header>
        <div className="border-b border-gray-200 mb-8">
          <Select
            placeholder={<div>Filter level</div>}
            options={tags}
            isMulti
            className="basic-multi-select my-4 w-full max-w-64 mx-4"
            styles={customStyles} 
            onChange={handleTagChange} // Add onChange handler
          />
        </div>
        {customers.map(customer => (
          <div key={customer.CusID} className="shadow-xl hover:bg-opacity-75 rounded-xl flex justify-between items-center px-4 py-2 ml-6 mr-16 mb-4">
            <div className="flex">
              <div>
                <IoPersonOutline className="text-6xl" />
              </div>
              <div className="pl-5 pt-2">
                <div className="flex">
                  <h2 className="font-bold text-black-700 pl-4 pr-2">
                    {customer.CusName}
                  </h2>
                  <div
                    className={`content-center font-semibold text-xs border rounded-xl px-2 ${
                      levelColors[customer.CusLevel] || "bg-black"
                    }`}
                  >
                    {customer.CusLevel}
                  </div>
                </div>
                <div className="flex font-semibold text-sm rounded py-0.5 px-4 mr-1/2 pb-2.5">
                  <h4>Email:</h4>
                  <p className="font-semibold text-sm rounded pl-1">
                    {customer.CusEmail}
                  </p>
                </div>
              </div>
            </div>
          <Link to={`/customer/edit/${customer.CusID}`}> 
            <button className="flex p-2.5 bg-teal-500 hover:bg-teal-700 rounded-xl hover:rounded-3xl  transition-all duration-300 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </Link>
        </div>
        ))}
        <footer className=' flex justify-center mt-8 my-8'>
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

export default Customer;
