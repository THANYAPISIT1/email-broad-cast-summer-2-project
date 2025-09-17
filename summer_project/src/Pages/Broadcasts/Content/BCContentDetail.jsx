
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from '../../../utils/api';
import Sidebar from "../../../Components/Layouts/Sidebar.jsx";
import TopNav from "../../../Components/Layouts/TopNav.jsx";
import Editor from "../../../Components/Layouts/Editor.jsx";
import NavbarTemplate from "../../../Components/Layouts/NavbarTemplate.jsx";

const BCCContentDetail = () => {
  const { TID } = useParams();
  const navigate = useNavigate();

  const [templateData, setTemplateData] = useState({
    TName: "",
    TContent: "",
  });

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/templates/${TID}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const templateData = response.data.template[0];
        console.log(templateData)
        setTemplateData({
          TName: templateData.TName,
          TContent: templateData.TContent,
        });
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    };

    fetchTemplateData();
  }, [TID]);

  const handleEditorDataChange = (editorData) => {
    setTemplateData((prevData) => ({ ...prevData, TContent: editorData }));
  };

  const handleNavbarDataChange = (navbarData) => {
    setTemplateData((prevData) => ({ ...prevData, TName: navbarData }));
  };

  const updateTemplate = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const putData = {
        TName: templateData.TName,
        TContent: templateData.TContent,
      };

      await axios.put(
        `${API_BASE_URL}/templates/${TID}`,
        putData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Template updated successfully!");
      alert("Template updated successfully!");
      navigate("/template");
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  return (
    <div>
      <Sidebar />
      <TopNav />
      <div className="mt-16">
        {/* Pass data to Navbar and Editor */}
          <NavbarTemplate defaultName={templateData.TName} onDataChange={handleNavbarDataChange} onPost={updateTemplate} />
          <Editor defaultContent={templateData.TContent} onDataChange={handleEditorDataChange} />
      </div>
    </div>
  );
};

export default BCCContentDetail;