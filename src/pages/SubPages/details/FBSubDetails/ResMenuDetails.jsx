import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoMdPrint } from "react-icons/io";
import { MdFeed } from "react-icons/md";
import Table from "../../../../components/table/Table";
import { domainPrefix, getRestaurtantMenuDetails } from "../../../../api";
import { useParams } from "react-router-dom";

const ResMenuDetails = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const {resid,id} = useParams()
  const [fbmenu, setFbmenu] = useState("");

  useEffect(() => {
    const fetchFB = async () => {
      try {
        const fbRes = await getRestaurtantMenuDetails(id,resid);
        console.log(fbRes.data);
        setFbmenu(fbRes.data);
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchFB();
  }, [id]);

 
  return (
    <div>
      <div className="md:mx-20 my-5 mb-10 sm:border border-gray-400 p-5 px-10 rounded-lg sm:shadow-xl">
        <h3 className="border-b text-center text-xl border-black mb-6 font-bold">
          PRODUCT SETUP DETAILS
        </h3>
        <div className="w-full mx-3 my-5 p-5 ">
          <h3 className="border-b text-center text-xl border-black mb-6 font-bold">
            OTHER INFO
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex gap-2">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="product-name"
              >
                Product Name:
              </label>
              <p>{fbmenu.name}</p>
            </div>
            <div className="flex gap-2">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="sku"
              >
                SKU:
              </label>
              <p>{fbmenu.sku}</p>
            </div>
            <div className="flex gap-2">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="master-price"
              >
                Master Price:
              </label>
              <p>{fbmenu.master_price}</p>
            </div>
            <div className="flex gap-2">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="display-price"
              >
                Display Price:
              </label>
              <p>{fbmenu.price}</p>
            </div>
            
            <div className="flex gap-2">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="active"
              >
                Active:
              </label>
             <p>{fbmenu.active?"Yes":"No"}</p>
            </div>
            <div className="flex gap-2">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="category"
              >
                Category:
              </label>
              <p>{fbmenu.category_name}</p>
            </div>
            <div className="flex gap-2">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="subcategory"
              >
                Subcategory:
              </label>
              <p>{fbmenu.sub_category_name}</p>
            </div>
            <div className="flex gap-2">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="description"
              >
                Description:
              </label>
              <p>{fbmenu.description}</p>
            </div>
          </div>
          <h3 className="border-b text-center text-xl border-black mb-6 font-bold">
          Images{" "}</h3>
           {fbmenu.documents?.length > 0 ? (
                                  fbmenu.documents.map(
                                    (attachment, i) => (
                                      <img
                                        key={i}
                                        src={domainPrefix + attachment.document}
                                        alt={`Attachment ${i + 1}`}
                                        // className="w-64 h-64  rounded-md"
                                        onClick={() =>
                                          window.open(
                                            domainPrefix + attachment.document,
                                            "_blank"
                                          )
                                        }
                                      />
                                    )
                                  )
                                ) : (
                                  <p>No Menu Image</p>
                                )}
        
        </div>
      </div>
     
     
     
    </div>
  );
};

export default ResMenuDetails;
