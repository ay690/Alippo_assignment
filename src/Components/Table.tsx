import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";

interface Person {
  name: string | null;
  age: number;
  city: string;
  pinCode: number | null;
}

const Table: React.FC = () => {
  const [data, setData] = useState<Person[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [modalName, setModalName] = useState<string>("");
  const [modalAge, setModalAge] = useState<number>(0);
  const [modalCity, setModalCity] = useState<string>("");
  const [modalPinCode, setModalPinCode] = useState<number | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    axios
      .get("https://assets.alippo.com/catalog/static/data.json")
      .then((response) => {
        console.log(response);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = () => {
    const pageNumbers = Array.from(
      { length: Math.ceil(data.length / itemsPerPage) },
      (_, index) => index + 1
    );

    return (
      <select
        value={currentPage}
        onChange={(e) => setCurrentPage(Number(e.target.value))}
      >
        {pageNumbers.map((pageNumber) => (
          <option key={pageNumber} value={pageNumber}>
            {pageNumber}
          </option>
        ))}
      </select>
    );
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleEdit = (index: number) => {
    const selectedPerson = data[index];
    setSelectedRow(index);
    setModalName(selectedPerson.name || "");
    setModalAge(selectedPerson.age);
    setModalCity(selectedPerson.city);
    setModalPinCode(selectedPerson.pinCode || null);
  };

  const handleDelete = (index: number) => {
    setDeleteConfirmation(index);
  };

  const confirmDelete = (index: number) => {
    if (index !== null) {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
      setDeleteConfirmation(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleSave = () => {
    if (selectedRow !== null) {
      const newData = [...data];
      newData[selectedRow].name = modalName || null;
      newData[selectedRow].age = modalAge;
      newData[selectedRow].city = modalCity;
      newData[selectedRow].pinCode = modalPinCode || null;
      setData(newData);
      setSelectedRow(null);
    }
  };

  const handleCancel = () => {
    setSelectedRow(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

//   const handleAdd = () => {
//     const newData: Person = { name: null, age: 0, city: "", pinCode: null };
//     setData([...data, newData]);
//     setSelectedRow(data.length);
//   };

  return (
    <div className="App">
      {/* <button onClick={handleAdd}>Add</button> */}
      <table>
        <thead>
          <tr>
            <th>SL.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Pin Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((person, index) => (
            <tr key={index}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{person.name || "-"}</td>
              <td>{person.age}</td>
              <td>{person.city}</td>
              <td>{person.pinCode || "-"}</td>
              <td>
                <button onClick={() => handleEdit(indexOfFirstItem + index)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(indexOfFirstItem + index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {selectedRow !== null && (
        <div className="modal">
          <label>Name</label>
          <input
            type="text"
            value={modalName}
            onChange={(e) => setModalName(e.target.value)}
          />
          <label>Age</label>
          <input
            type="number"
            value={modalAge}
            onChange={(e) => setModalAge(parseInt(e.target.value, 10))}
          />
          <label>City</label>
          <input
            type="text"
            value={modalCity}
            onChange={(e) => setModalCity(e.target.value)}
          />
          <label>Pin Code</label>
          <input
            type="number"
            value={modalPinCode || ""}
            onChange={(e) => setModalPinCode(parseInt(e.target.value, 10))}
          />
          <div className="btns-group">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {deleteConfirmation !== null && (
        <div className="modal">
          <p>Are you sure you want to delete this entry?</p>
          <button onClick={() => confirmDelete(deleteConfirmation)}>
            Confirm
          </button>
          <button onClick={cancelDelete}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Table;
