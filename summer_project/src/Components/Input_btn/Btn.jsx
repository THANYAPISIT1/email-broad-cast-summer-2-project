import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/api';

function Btn({ handleNext, handlePrevious, currentIndex, totalSteps, broadcastName, email, selectedLevel , selectedTID, tag, blacklist, sqlDate, fromName,recipientEveryone }) {
  console.log(broadcastName, email, selectedLevel , selectedTID, tag,)
  const navigate = useNavigate();

  const handleSubmit = async () => {

    const authToken = localStorage.getItem('token'); // Retrieve the token from localStorage
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/broadcasts`,
        {
          BName: broadcastName,
          BSchedule: sqlDate || '', // get BSchedule
          BTag: tag,
          BFrom: fromName, // get BFrom
          BRecipient: email || (selectedLevel ? selectedLevel.value : null),
          TID: selectedTID,
          blacklist: blacklist || '' 

        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      console.log('Response:', response);
      navigate('/');

    } catch (error) {
      console.error('Error creating broadcast:', error);
    }


  };

  return (
      <div className="flex ml-2">
        <button
          type="button"
          className="underline underline-offset-auto inline-block rounded px-2 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700"
        >
          Save
        </button>

        <button
          type="button"
          className="mx-2 inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Prev
        </button>

        {currentIndex < totalSteps - 1 ? (
          <button
            type="button"
            className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            onClick={handleNext}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
      </div>
  );
}


export default Btn;