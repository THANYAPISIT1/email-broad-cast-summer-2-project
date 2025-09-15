import { useState, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';

const customStyles = {
  control: base => ({
    ...base,
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    minHeight: 'calc(2.25rem + 2px)',
    boxShadow: 'none',
  }),
};

const Filter = ({ onStatusChange, onTagChange, onFilterChange, onDateRangeChange }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterByTags, setFilterByTags] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const fetchTags = async () => {
    try {
      const authToken = localStorage.getItem('token');

      const response = await axios.get(`${API_BASE_URL}/filtertags`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      console.log('API Response:', response.data);

      if (response.data && Array.isArray(response.data.BTags)) {
        const tags = response.data.BTags.map(tag => ({ label: tag.BTag, value: tag.BTag }));
        setFilterByTags(tags);
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const filterByStatus = [
    { label: 'Draft', value: 'Draft' },
    { label: 'Sent', value: 'Sent' },
    { label: 'Schedule', value: 'Schedule' },
  ];

  const filterByFilter = [
    { label: 'Last Updated', value: 'Last Updated' },
    { label: 'Email Sent', value: 'Email Sent' },
    { label: 'Name', value: 'Name' },
  ];

  const handleTagsChange = (newValue) => {
    setSelectedTags(newValue);
    onTagChange(newValue);
  };

  const handleStatusChange = (newValue) => {
    setSelectedStatus(newValue);
    onStatusChange(newValue);
  };

  const handleFilterChange = (newValue) => {
    setSelectedFilter(newValue);
    onFilterChange(newValue);
  };

  const handleDateRangeChange = (update) => {
    setDateRange(update);
    onDateRangeChange(update);
  };

  useEffect(() => {
    console.log("Selected Status:", selectedStatus);
  }, [selectedStatus]);

  useEffect(() => {
    console.log("Selected Filter:", selectedFilter);
  }, [selectedFilter]);

  return (
    <div className='z-50'>
      <div className="flex items-center">
        <CreatableSelect
          placeholder={<div>Type</div>}
          isClearable
          styles={customStyles}
          className="my-4 w-full max-w-64 mx-4"
          options={filterByStatus}
          value={selectedStatus}
          onChange={handleStatusChange}
        />

        <DatePicker
          className="my-4 w-full max-w-64 border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateRangeChange}
          isClearable={true}
          placeholderText="Select Date Range"
        />

        <Select
          placeholder={<div>Select Tags</div>}
          options={filterByTags}
          isMulti
          className="basic-multi-select my-4 w-full max-w-64 ml-4"
          styles={customStyles}
          value={selectedTags}
          onChange={handleTagsChange}
        />

        <CreatableSelect
          placeholder={<div>Filter</div>}
          isClearable
          styles={customStyles}
          className="my-4 w-full max-w-64 mx-4"
          options={filterByFilter}
          value={selectedFilter}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default Filter;
