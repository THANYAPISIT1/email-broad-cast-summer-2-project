import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../../../utils/api';
import { Pagination } from "@nextui-org/react";


const BCContent = ({ setContentName, setSelectedTemplate, broadcastName, email, selectedLevel , tag, blacklist, sqlDate, fromName,recipientEveryone }) => {
  const [templates, setTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [highlightedTemplate, setHighlightedTemplate] = useState(null);
  const [selectedTID, setSelectedTID] = useState(null);
  const [selectedTName, setSelectedTName] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/templates?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = response.data;
        setTemplates(data.templates);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, [currentPage]);

  const handleTemplateClick = (templateId, templateName) => {
    const selectedTemplate = templates.find(
      (template) => template.TID === templateId,
      (template) => template.TName ===  templateName
    );
    setSelectedTID(templateId);
    setSelectedTName(templateName);
    setSelectedTemplate({ TID: templateId, TName: templateName });
    setHighlightedTemplate(templateId);
    setContentName(selectedTemplate.TName);
  };

  const handleTemplateDoubleClick = (templateId) => {
    const selectedTemplate = templates.find(
      (template) => template.TID === templateId
    );
    navigate(`/template/edit/${templateId}`, {
      state: { template: selectedTemplate },
    });
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
};
  
  return (
    <div>
      <div>
        <div className="border-2 text-black flex flex-row">
          <div className="flex content-center mt-2">
            <div>
              <div className="text-black flex flex-row">
                <div className="basis-5/6 pl-8 p-2 mt-2">
                  Your <span className="text-green-500">template</span>
                </div>
                <div className="flex content-center my-2">
                  <div>
                    <button className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 rounded-full">
                      <Link to="/template/create">Create new template</Link>
                    </button>
                  </div>
                </div>
              </div>
              <hr />
              <div>

              <div className="flex flex-wrap columns-5 place-content-center">
                {templates.map((template) => (
                  <div
                    key={template.TID}
                    className={`mx-5 w-64 my-4 text-center text-cyan-700 hover:text-white border-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none box-border p-10 border-4 rounded-lg ${
                      highlightedTemplate === template.TID
                        ? "bg-blue-200"
                        : ""
                    }`}
                    onClick={() => handleTemplateClick(template.TID,template.TName)}
                    onDoubleClick={() => handleTemplateDoubleClick(template.TID)}
                  >
                    {template.TName}
                  </div>
                ))}
              </div>
              </div>
              <footer className='flex justify-center mt-8 my-8'>
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
        </div>
      </div>
    </div>
  );
};

export default BCContent;
