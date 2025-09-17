import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../../utils/api';
import Sidebar from "../../Components/Layouts/Sidebar";
import TopNav from "../../Components/Layouts/TopNav";
import { Pagination } from "@nextui-org/react";
import { Button } from "@nextui-org/button";


const Template = () => {
  const [templates, setTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [highlightedTemplate, setHighlightedTemplate] = useState(null);

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

  const handleTemplateClick = (templateId) => {
    console.log(`Template ${templateId} clicked`);
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
      <Sidebar />
      <TopNav />

      <div className="mt-16">
        <div className="ml-64 flex justify-between items-center bg-white text-black text-3xl font-bold p-8">
          Let’s create your template
        </div>
        <div className="border-b border-gray-200 ml-64"></div>
        <div>
          <div className="ml-64 text-black flex flex-row">
            <div className="basis-5/6 pl-8 mt-4">
              Your <span className="text-green-500">template</span>
            </div>
            <div className="flex content-center p-2">
              <div>
                <Button color="primary" variant="ghost">
                  <Link to="/template/create">Create new template</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 ml-64"></div>
          <div className="ml-64 flex flex-wrap columns-5 place-content-center">
            {templates.map((template) => (
              <div
                key={template.TID}
                className="mx-5 w-64 my-4 text-center text-cyan-700 hover:text-white border-cyan-700 hover:bg-cyan-700 focus:ring-4 focus:outline-none box-border p-10 border-4 rounded-lg"
                onClick={() => handleTemplateClick(template.TID)}
              >
                {template.TName}
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default Template;
