import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from "../../services/services";
import Dropdown from 'react-bootstrap/Dropdown';
import ProductDetailsModal from '../product-details-model/ProductDetailsModal';
import ProductDeleteModel from '../product-delete-model/ProductDeleteModel';
import UpdateProduct from '../update-product/UpdateProduct';

const EmployeeList = (props) => {
    const [employees, setEmployees] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [requestComplete, setRequestComplete] = useState(false);
    const [sortBy, setSortBy] = useState(1); // Default sort value
    const [show, setShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // Initialize selectedProduct to null
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const handleClose = () => {
        setShow(false);
        setShowConfirmationModal(false); // Close the confirmation modal
    };

    const handleShow = (product) => {
        setSelectedProduct(product); // Set the selected product
        setShow(true);
    };

    const getData = () => {
        getEmployees(sortBy)
            .then(
                (httpResponse) => {
                    const records = httpResponse.data;
                    setEmployees(records);
                    setErrorMessage('');
                    setRequestComplete(true);
                }
            )
            .catch(
                (err) => {
                    setEmployees(undefined);
                    setErrorMessage(err.message);
                    setRequestComplete(true);
                }
            )
    }

    useEffect(() => {
        getData();
    }, [sortBy]);

    const handleAction = (action, productId) => {
        console.log(`Performing ${action} on product ${productId}`);
        if (action === 'Delete') {
            setSelectedProduct(productId);
            setShowConfirmationModal(true);
        }
        if (action === 'edit') {
            setSelectedProduct(productId);
            setShowConfirmationModal(true);
        }
    }

    const handleDeleteConfirmed = () => {
        deleteEmployee(selectedProduct)
            .then(() => {
                console.log(`Product ${selectedProduct} deleted successfully`);
                setShowConfirmationModal(false);
                getData();
            })
            .catch((err) => {
                console.error('Error deleting product:', err);
            });
    }

    let design;
    if (!requestComplete) {
        design = <span>Loading...please wait</span>;
    } else if (errorMessage !== '') {
        design = <span>{errorMessage}</span>;
    } else if (!employees || employees.length === 0) {
        design = <span>No records</span>;
    } else {
        design = (
            <>
                <div>
                    <select value={sortBy} onChange={(e) => setSortBy(parseInt(e.target.value))}>
                        {[
                            { value: 1, label: "Sort by ID" },
                            { value: 2, label: "Sort by Name" },
                            { value: 3, label: "Sort by Price" }

                        ].map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <br />
                <table className='table table-hover table-light'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Image URL</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((e) => (
                            <tr key={e.product_id}>
                                <td>{e.product_id}</td>
                                <td>{e.product_name}</td>
                                <td>{e.price}</td>
                                {/* <td>{e.product_code}</td>
                                <td>{e.release_date}</td> */}
                                <td>
                                    <img src={e.image_url} alt={e.product_name} style={{ width: '100px', height: '100px' }} />
                                </td>
                                <td>
                                    <div className="btn-group">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="bg-light border shadow-sm" id="dropdown-basic">
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item variant="primary" onClick={() => handleShow(e)}>View</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleAction('Edit', e.product_id)}>Edit</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleAction('Delete', e.product_id)}>Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    }
    return (
        <>
            {design}
            {/* Confirmation modal for delete action */}
            <ProductDeleteModel show={showConfirmationModal} handleClose={handleClose} handleDeleteConfirmed={handleDeleteConfirmed}
            />
            {/* Edit Product */}
            {showEdit && <UpdateProduct product={selectedProduct} handleClose={() => setShowEdit(false)} />}
            {/* Product details modal */}
            {selectedProduct && <ProductDetailsModal show={show} handleClose={handleClose} product={selectedProduct} />}
        </>
    );
}

export default EmployeeList;