import { useEffect, useState } from "react";
import './ReturnList.css';
import './Return.css';
import { Modal, Button } from "react-bootstrap";
import { ArrowCounterclockwise, ArrowLeftCircle, ArrowReturnLeft, BoxArrowLeft, Bucket, BucketFill, Dropbox, PaintBucket } from "react-bootstrap-icons";
import { APPEnv } from "../config";

const ReturnList = () => {
    const [returnOrders, setReturnOrders] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orderStatusMap = {
        0: "Not Paid",
        1: "Paid",
        2: "Exchanged",
    };

  const getStatusClass = (status) => {
  switch (status) {
    case 0: return "status-not-paid";
    case 1: return "status-paid";
    case 2: return "status-exchanged";
    default: return "";
  }
};


    const openModal = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    const getreturnorder = () => {
        let user = localStorage.getItem('token');
        user = JSON.parse(user);
        fetch(APPEnv.baseUrl + '/B2CReturn/Getbycode?OrganizationId=' + process.env.REACT_APP_BACKEND_ORGANIZATION + '&CustomerCode=' + user[0].B2CCustomerId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log("return",data)
                if (data.Code === 200) {
                    setReturnOrders([...data.Data].reverse()); 
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        getreturnorder();
    }, []);

    return (
        <div>
            <div className="Return-container">
                <div className="returnorders">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                {/* <th>Customer Name</th> */}
                                <th>Created Date</th>
                                {/* <th>Order Status</th> */}
                                <th>Return Status</th>
                                <th>Product Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnOrders.map((item) => (
                                <tr key={item.OrderNo}>
                                    <td>{item?.OrderNo}</td>
                                    {/* <td>{item?.CustomerName}</td> */}
                                    <td>{item?.TranDateString}</td>
              <td>
  <p style={{
    color: Number(item.ReturnStatus) === 0 ? "red"
          : Number(item.ReturnStatus) === 1 ? "green"
          : Number(item.ReturnStatus) === 2 ? "blue"
          : "black"
  }}>
    {orderStatusMap[Number(item.ReturnStatus)] ?? "Unknown Status"}
  </p>
</td>


                                    <td>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <button className="mainbutton1" onClick={() => openModal(item)}>
            <BoxArrowLeft size={22} />
        </button>
    </div>
</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for displaying return details */}
            <Modal show={isModalOpen} onHide={closeModal} centered>
                
                <Modal.Header closeButton>
                    <Modal.Title  className="text-start w-100">Return Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && selectedOrder.ReturnDetail ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product Code</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.ReturnDetail.map((product, index) => (
                                    <tr key={index}>
                                        <td  className="text-start">{product?.ProductCode}</td>
                                        <td className="text-start">{product?.ProductName}</td>
                                        <td className="text-start">{product?.Qty}</td>
                                        <td className="text-start">${product?.Price.toFixed(2)}</td>
                                        <td className="text-start">${product?.Total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No return details available.</p>
                    )}
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer> */}
            </Modal>
        </div>
    );
};

export default ReturnList;
