import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { API_BASE_URL } from '../../utils/api';
import TopNav from '../../Components/Layouts/TopNav';
import Sidebar from '../../Components/Layouts/Sidebar';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import {Button} from "@nextui-org/react";
import {UserIcon} from '../../Components/Input_btn/UserIcon';

function CustomerEdit() {
  const [name, setName] = useState(null);
  const [level, setLevel] = useState(null);
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();
  const { CusID } = useParams();

  const levelOptions = [
    { value: 'Silver', label: 'Silver' },
    { value: 'Gold', label: 'Gold' },
    { value: 'Platinum', label: 'Platinum' },
    { value: 'Diamond', label: 'Diamond' },
  ];

  const handleChange = (selectedOption) => {
    setLevel(selectedOption.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/customers/${CusID}`,{
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        const customerData = response.data.customer[0]

        setName(customerData.CusName);
        setEmail(customerData.CusEmail);
        setLevel(customerData.CusLevel);
        

      } catch (error) {
        console.error('Error fetching customer:', error);
      }
    };

    fetchData();
  }, [CusID]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const authToken = localStorage.getItem('token'); // Retrieve the token from localStorage

    try {
      await axios.put(
        `${API_BASE_URL}/customers/${CusID}`,
        {
          CusName: name,
          CusEmail: email,
          CusLevel: level
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      setTimeout(() =>{
        navigate("/customers");
      }, 2000 )
      
    } catch (error) {
      console.error('Error updating customer:', error);
    }

    
  };

  const handleCancel = () => {
    navigate('/customers')
  };

  const handleDelete = async () => {
    try {
      const authToken = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/customers/delete/${CusID}`, null, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      navigate("/customers");
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };



  return (
    <div>
      <TopNav />
      <Sidebar />
      <div className='ml-64 mt-16 py-3'>
      { name && level && email ? (
        <form onSubmit={handleSubmit} className='flex flex-col gap-2.5 p-5'>
          <div className='flex justify-between'>
            <h2 className='font-bold font-sans text-xl mb-4'>Edit Customer</h2>
            <Button color="danger" variant="bordered" startContent={<UserIcon/>} onClick={handleDelete} >Delete user</Button>
          </div>
          <div className='flex gap-2.5'>
            
            <div className='basis-1/2'>
              <label htmlFor="name" className='flex font-bold text-base mb-2.5'>Name</label>
              <input
                className='p-2.5 shadow appearance-none border rounded-2xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full'
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className='ml-2.5'>
              <label className="text-black font-bold text-base" htmlFor="level">Level</label>
              <Select
                options={levelOptions}
                value={levelOptions.find((option) => option.value === level)}
                onChange={handleChange}
                className="basic-multi-select mt-2.5 w-max"
              />
            </div>
          </div>
          <label htmlFor="email" className='flex font-bold text-base'>Email</label>
          <input
            className='p-2.5 shadow appearance-none border rounded-2xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-1/2'
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <div className='flex flex-row-reverse gap-4 mt-4'>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
            
            <Button color="danger" variant="light" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div>Loading... </div>
      )}
      </div>
    </div>
  );
}

export default CustomerEdit;