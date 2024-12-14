// import React from 'react'
// import { useSelector } from "react-redux";
// import Table from '../../../../components/table/Table';
// import { IoMdPrint } from 'react-icons/io'
// import { MdFeed } from 'react-icons/md'

// const ResOrderDetails = () => {
//     const themeColor = useSelector((state)=> state.theme.color)
//     const column = [



//         { name: "Date", selector: (row) => row.Date, sortable: true },
//         { name: "Status", selector: (row) => row.Status, sortable: true },
//         { name: "Comments", selector: (row) => row.Comments, sortable: true },
//         { name: "Updated by", selector: (row) => row.Updated, sortable: true },



//       ];
//       const data = [
//         {
//           id: 1,
//           Date:"09/12/2024",
//           Status:"Pending",
//           Comments: "",
//           Updated:"Mittu Panda"
//         },


//       ];

     
//   return (
//     <div className='rounded-lg sm:shadow-xl sm:border border-gray-400'>
//         <div className="md:mx-20    p-5 px-10 ">
//   <h3 className="border-b text-center text-xl border-black mb-6 font-bold">RESTAURTANT ORDER DETAILS</h3>
 
//   <div className="w-full mx-3  p-5  ">
//   <h3 className="border-b text-center text-xl border-black mb-6 font-bold">HAVEN CAFE</h3>

//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//     <div className="mb-4">
//       <p className="text-gray-700 font-bold mb-2">Delivery Address:</p>
//       <p className="text-gray-700">Aquil Husain</p>
//       <p className="text-gray-700">GoPhygital</p>
//       <p className="text-gray-700">Manager</p>
//       <p className="text-gray-700">91 98202261424</p>
//     </div>
//     <div className="mb-4">
//       <p className="text-gray-700 font-bold mb-2">Order ID:</p>
//       <p className="text-gray-700">1205</p>
//     </div>
//     <div className="mb-4">
//       <p className="text-gray-700 font-bold mb-2">Order Date:</p>
//       <p className="text-gray-700">21/05/2024 12:28 PM</p>
//     </div>
//     <div className="mb-4">
//       <p className="text-gray-700 font-bold mb-2">Payment Mode:</p>
//       <p className="text-gray-700">[Payment Mode]</p>
//     </div>
//     <div className="mb-4">
//       <p className="text-gray-700 font-bold mb-2">Payment Status:</p>
//       <p className="text-gray-700">[Payment Status]</p>
//     </div>
//     <div className="mb-4">
//       <p className="text-gray-700 font-bold mb-2">Transaction ID:</p>
//       <p className="text-gray-700">[Transaction ID]</p>
//     </div>
//     <div className="mb-4">
//       <p className="text-gray-700 font-bold mb-2">Preferred Time:</p>
//       <p className="text-gray-700">[Preferred Time]</p>
//     </div>
//     <div className="mb-4">
//       <p className="text-gray-700 font-bold mb-2">Discount(%):</p>
//       <p className="text-gray-700">5</p>
//     </div>
//     </div>
//   </div>
// </div>

// <div className="md:mx-20  mb-10  p-5 px-10 ">
// <p className='p-5 bg-green-600 text-white rounded-md'>Pending</p>

//   <h3 className="border-b text-center text-xl border-black mb-6 font-bold">ORDER SUMMARY</h3>
//   <div className="w-full mx-3 my-5 p-5 ">
//     <table className="min-w-full bg-white">
//       <thead>
//         <tr>
//           <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-gray-700 font-bold">Item List</th>
//           <th className="py-2 px-4 border-b-2 border-gray-300 text-right text-gray-700 font-bold">Total Price</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td className="py-2 px-4 border-b border-gray-300 text-gray-700">Upma With Chutney & Sambar</td>
//           <td className="py-2 px-4 border-b border-gray-300 text-right text-gray-700">Rs. 40.0 x 1</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b border-gray-300 text-gray-700 font-bold">Sub Total :</td>
//           <td className="py-2 px-4 border-b border-gray-300 text-right text-gray-700">Rs. 40.00</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b border-gray-300 text-gray-700 font-bold">GST :</td>
//           <td className="py-2 px-4 border-b border-gray-300 text-right text-gray-700">Rs. 0.00</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b border-gray-300 text-gray-700 font-bold">Service Charge :</td>
//           <td className="py-2 px-4 border-b border-gray-300 text-right text-gray-700">Rs. 0.00</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b border-gray-300 text-gray-700 font-bold">Delivery Charge :</td>
//           <td className="py-2 px-4 border-b border-gray-300 text-right text-gray-700">Rs. 0.00</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 border-b border-gray-300 text-gray-700 font-bold">Discount :</td>
//           <td className="py-2 px-4 border-b border-gray-300 text-right text-gray-700">Rs. 0.00</td>
//         </tr>
//         <tr>
//           <td className="py-2 px-4 text-gray-700 font-bold">TOTAL :</td>
//           <td className="py-2 px-4 text-right text-gray-700 font-bold">Rs. 40.00</td>
//         </tr>
//       </tbody>
//     </table>
//   </div>
// </div>


// <div className="md:mx-20 my-5 mb-10  p-5 px-10 ">
// <h3 className="border-b text-center text-xl border-black mb-6 font-bold">GST </h3>
// <Table
//               columns={column}
//               data={data}
              
             
//             />
// </div>
//     </div>
//   )
// }

// export default ResOrderDetails
import React from "react";
import { Printer, FileText } from "lucide-react";
import Table from '../../../../components/table/Table';

const ResOrderDetails = () => {
  const orderStatusColor = {
    Pending: "bg-yellow-500 text-white",
    Completed: "bg-green-500 text-white",
    Cancelled: "bg-red-500 text-white",
  };

  const orderDetails = {
    restaurantName: "HAVEN CAFE",
    orderId: "1205",
    orderDate: "21/05/2024 12:28 PM",
    paymentMode: "Credit Card",
    paymentStatus: "Paid",
    transactionId: "TXN123456",
    preferredTime: "ASAP",
    discount: "5%",
    status: "Pending",
  };

  const deliveryAddress = {
    name: "Mittu Panda",
    company: "",
    position: "",
    phone: "91 98202261424",
  };

  const orderItems = [
    { name: "Upma With Chutney & Sambar", price: 40.0, quantity: 1 },
  ];

  const orderSummary = {
    subTotal: 40.0,
    gst: 0.0,
    serviceCharge: 0.0,
    deliveryCharge: 0.0,
    discount: 0.0,
    total: 40.0,
  };

  const gstData = [
    {
      id: 1,
      Date: "09/12/2024 10:00 AM",
      Status: "Pending",
      Comments: "",
      Updated: "Mittu Panda",
    },
  ];
  const column = [



            { name: "Date", selector: (row) => row.Date, sortable: true },
            { name: "Status", selector: (row) => row.Status, sortable: true },
            { name: "Comments", selector: (row) => row.Comments, sortable: true },
            { name: "Updated by", selector: (row) => row.Updated, sortable: true },
    
    
    
          ];
          const data = [
            {
              id: 1,
              Date:"09/12/2024 8:00 AM",
              Status:"Pending",
              Comments: "",
              Updated:"Mittu Panda"
            },
    
    
          ];
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Restaurant Order Details */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">RESTAURANT ORDER DETAILS</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Address */}
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{orderDetails.restaurantName}</h2>
            <div className="mt-4 space-y-2">
              <p><strong>Delivery Address:</strong></p>
              <p>{deliveryAddress.name}</p>
              <p>{deliveryAddress.company}</p>
              <p>{deliveryAddress.position}</p>
              <p>{deliveryAddress.phone}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 p-4 rounded shadow grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Order ID:</p>
              <p>{orderDetails.orderId}</p>
            </div>
            <div>
              <p className="font-semibold">Order Date:</p>
              <p>{orderDetails.orderDate}</p>
            </div>
            <div>
              <p className="font-semibold">Payment Mode:</p>
              <p>{orderDetails.paymentMode}</p>
            </div>
            <div>
              <p className="font-semibold">Payment Status:</p>
              <p>{orderDetails.paymentStatus}</p>
            </div>
            <div>
              <p className="font-semibold">Transaction ID:</p>
              <p>{orderDetails.transactionId}</p>
            </div>
            <div>
              <p className="font-semibold">Preferred Time:</p>
              <p>{orderDetails.preferredTime}</p>
            </div>
            <div>
              <p className="font-semibold">Discount:</p>
              <p>{orderDetails.discount}</p>
            </div>
            <div>
              <p className="font-semibold">Status:</p>
              <span className={`py-1 px-2 rounded ${orderStatusColor[orderDetails.status]}`}>
                {orderDetails.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className=" bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">ORDER SUMMARY</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>Item List</th>
              <th className="text-right">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td>{item.name}</td>
                <td className="text-right">
                  Rs. {item.price.toFixed(2)} x {item.quantity}
                </td>
              </tr>
            ))}
            <tr className="border-t">
              <td className="font-bold">Sub Total :</td>
              <td className="text-right">Rs. {orderSummary.subTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="font-bold">CGST :</td>
              <td className="text-right">Rs. {orderSummary.gst.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="font-bold">SGST  :</td>
              <td className="text-right">Rs. {orderSummary.gst.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="font-bold">IGST :</td>
              <td className="text-right">Rs. {orderSummary.gst.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="font-bold">Service Charge :</td>
              <td className="text-right">Rs. {orderSummary.serviceCharge.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="font-bold">Delivery Charge :</td>
              <td className="text-right">Rs. {orderSummary.deliveryCharge.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="font-bold">Discount :</td>
              <td className="text-right">Rs. {orderSummary.discount.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="font-bold text-lg">TOTAL :</td>
              <td className="text-right font-bold text-lg">Rs. {orderSummary.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* GST Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Logs</h2>
        <Table
              columns={column}
              data={data}
              />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button className="flex items-center border rounded px-4 py-2 hover:bg-gray-100">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </button>
        <button className="flex items-center border rounded px-4 py-2 hover:bg-gray-100">
          <FileText className="mr-2 h-4 w-4" />
          Generate Invoice
        </button>
      </div>
    </div>
  );
};

export default ResOrderDetails;
