import React, { useEffect, useState } from "react";
import FileInputBox from '../../../../containers/Inputs/FileInputBox'
import Navbar from '../../../../components/Navbar'
import { postRestaurtantMenu,getGenericCategoryRestaurtant, getGenericSubGroup, getRestaurtantMenuDetails, EditRestaurtantMenuDetails } from '../../../../api'
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const EditResMenu = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const {resid,id} = useParams();
  const [details, setDetails] = useState([]);
  const [subcatdetails, setsubcatDetails] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const siteDetailsResp = await getGenericCategoryRestaurtant();
        
        setDetails(siteDetailsResp.data);
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, []);
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    master_price:"",
    price: "",
    active: true,
    category_id: "",
    sub_category_id: "",
    description: "",
    attachments:[]
  });
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      try {
        const siteDetailsResp = await getRestaurtantMenuDetails(id,resid);
        
        setFormData(siteDetailsResp.data);
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, [id]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const fetchSubCategory = async (categoryId) => {
    try {
      const siteDetailsResp = await getGenericSubGroup(categoryId);
      setsubcatDetails(siteDetailsResp.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (formData.category_id) {
      fetchSubCategory(formData.category_id); // Pass formData.category_id to fetchSubCategory
    }
  }, [formData.category_id]);
  const handleFileChange = (files, fieldName) => {
    // Changed to receive 'files' directly
    setFormData({
      ...formData,
      [fieldName]: files,
    });
    console.log(fieldName);
  };
  const navigate = useNavigate()
  const handleEditMenu = async () => {
    
   
    const sendData = new FormData();
    sendData.append("restaurant_menu[restaurant_id]", resid);
    sendData.append("restaurant_menu[sku]", formData.sku);
    sendData.append("restaurant_menu[name]", formData.name);
    sendData.append("restaurant_menu[price]", formData.price);
    sendData.append("restaurant_menu[master_price]", formData.master_price);
    sendData.append("restaurant_menu[active]", formData.active);
    sendData.append("restaurant_menu[category_id]", formData.category_id);
    sendData.append("restaurant_menu[sub_category_id]", formData.sub_category_id);
    sendData.append("restaurant_menu[description]", formData.description);
    // formData.attachments.forEach((file)=>{
    //   sendData.append("attachments[]", file)
    // })
    try {
      const resp = await EditRestaurtantMenuDetails(id,resid,sendData);
      console.log(resp);
      navigate(`/fnb/restaurtant-menu/${id}`);
      toast.success("Restaurtant Menu updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex'>
<Navbar/>
        <div className="w-full md:mx-20 my-5 mb-10 sm:border border-gray-400 p-5 px-10 rounded-lg sm:shadow-xl">
  <h3 className="border-b text-center text-xl border-black mb-6 font-bold">Edit PRODUCT</h3>
  <div className="w-full mx-3 my-5 p-5 shadow-lg rounded-lg border border-gray-300">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="product-name">Product Name*</label>
        <input 
                  className="border p-1 px-4 border-gray-500 rounded-md"    
                  onChange={handleChange}
                  value={formData.name}
                  id="product-name" 
                  type="text" 
                  name='name'
                  placeholder="name" 
                  />
      </div>
      <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="sku">SKU*</label>
        <input 
          className="border p-1 px-4 border-gray-500 rounded-md"   
          onChange={handleChange}
          value={formData.sku}
          id="sku" 
          type="text" 
          name='sku'
          placeholder="sku"
          />
      </div>
      <div className="grid gap-1">
        <label 
        
        className=" text-gray-700 font-bold " htmlFor="master-price">Master Price*</label>
        <input 
className="border p-1 px-4 border-gray-500 rounded-md"
value={formData.master_price}
onChange={handleChange}
name='master_price'
        id="master-price" type="text" placeholder="Master Price" />
      </div>
      <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="display-price">Display Price</label>
        <input 
className="border p-1 px-4 border-gray-500 rounded-md"
value={formData.price}
onChange={handleChange}
name='price'
        id="display-price" type="text" placeholder="Display Price" />
      </div>
      {/* <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="stock">Stock</label>
        <input 
className="border p-1 px-4 border-gray-500 rounded-md"    

id="stock" type="text" placeholder="Stock" />
      </div> */}
      <div className="grid gap-1">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="active">Active</label>
        <select 
className="border p-1 px-4 border-gray-500 rounded-md"   
onChange={handleChange}
          value={formData.active}  name='active'   id="active">
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="category">Category*</label>
        <select 
className="border p-1 px-4 border-gray-500 rounded-md"   
onChange={handleChange}
          value={formData.category_id}
          name='category_id'
id="category">
          <option value="">Select Category</option>
          {details.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
        </select>
      </div>
      <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="subcategory">Subcategory</label>
        <select 
className="border p-1 px-4 border-gray-500 rounded-md"
onChange={handleChange}
          value={formData.sub_category_id}
        id="subcategory"
        name='sub_category_id'
        >
          <option value="">Select Subcategory</option>
          {subcatdetails.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
        </select>
      </div>
      {/* <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="subcategory">Menu Type</label>
        <select 
className="border p-1 px-4 border-gray-500 rounded-md"
        id="subcategory">
          <option value="">Select Menu Type</option>
          <option value="">Veg</option>
          <option value="">Non Veg</option>
          
        </select>
      </div>
      <div className="grid gap-1">
        <label className=" text-gray-700 font-bold" htmlFor="sgst-rate">Discount(%)</label>
        <input 
className="border p-1 px-4 border-gray-500 rounded-md"
id="sgst-rate" type="text" placeholder="Discount" />
      </div> */}
      {/* <div className="grid gap-1">
        <label className=" text-gray-700 font-bold" htmlFor="sgst-rate">SGST Rate</label>
        <input 
className="border p-1 px-4 border-gray-500 rounded-md"
id="sgst-rate" type="text" placeholder="SGST Rate" />
      </div>
      <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="sgst-amount">SGST Amount</label>
        <input 
className="border p-1 px-4 border-gray-500 rounded-md"
id="sgst-amount" type="text" placeholder="SGST Amount" />
      </div>
      <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="cgst-rate">CGST Rate</label>
        <input 
className="border p-1 px-4 border-gray-500 rounded-md"
id="cgst-rate" type="text" placeholder="CGST Rate" />
      </div>
      <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="cgst-amount">CGST Amount</label>
        <input
className="border p-1 px-4 border-gray-500 rounded-md"
id="cgst-amount" type="text" placeholder="CGST Amount" />
      </div>
      <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="igst-rate">IGST Rate</label>
        <input 
className="border p-1 px-4 border-gray-500 rounded-md"
id="igst-rate" type="text" placeholder="IGST Rate" />
      </div>
      <div className="grid gap-1">
        <label className=" text-gray-700 font-bold " htmlFor="igst-amount">IGST Amount</label>
        <input 
className="border p-1 px-4 border-gray-500 rounded-md"
id="igst-amount" type="text" placeholder="IGST Amount" />
      </div> */}
     
    </div>
    <div className="grid gap-1 mb-2">
        <label className=" text-gray-700 font-bold " htmlFor="description">Description</label>
        <textarea 
          className="border p-1 px-4 border-gray-500 rounded-md"
          onChange={handleChange}
          value={formData.description}
          id="description" 
          placeholder="description" 
          name='description'
/>
      </div>
    <label htmlFor="">Attachment</label>
    <FileInputBox
              handleChange={(files) =>
                handleFileChange(files, "attachments")
              }
              fieldName={"attachments"}
              isMulti={true}
            />
  </div>
  <div className="flex justify-center">
                <button
                 onClick={handleEditMenu}
                  style={{ background: themeColor }}
                  className="bg-black text-white p-2 px-4 rounded-md font-medium"
                >
                  Update
                </button>
              </div>
</div>

    </div>
  )
}

export default EditResMenu