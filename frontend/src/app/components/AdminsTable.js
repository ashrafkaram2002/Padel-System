"use client"; 

import { useState } from "react";
import { MdDelete } from "react-icons/md";
import axios from "axios";

export default function AdminsTable({ adminsData=[], loading, fetchAdminsData }) {

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [message, setMessage] = useState("");

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (adminToDelete) {
      try {
        await axios.delete('http://localhost:8000/removeAdmin', {
          params: { username:  adminToDelete.username} 
        });
        setMessage("Admin deleted successfully")
        setShowConfirmModal(false);
        fetchAdminsData(); // Refresh admins data after deletion
      } catch (error) {
        console.error('Error deleting admin:', error);
        setMessage("Error deleting admin:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setAdminToDelete(null);
    setMessage("");
  };

  return (
    <div className="players-table-container" style={{marginLeft:"2rem", marginRight:"2rem"}}>
      {loading ?
      (<div className="flex justify-center items-center">
         <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white"></div>
      </div>): (<table className="players-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {adminsData.length > 0 ? (
            adminsData.map((item, index) => (
              <tr key={index}>
                <td>{item.username}</td>
                <td style={{display:"flex", justifyContent:"center", justifyItems:"center"}}>
                   <MdDelete onClick={() => handleDeleteClick(item)} className="delete-icon"  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-data">No data found</td>
            </tr>
          )}
        </tbody>
      </table>)}

      {/* Modal for delete confirmation */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="confirmation-message">Are you sure you want to delete {adminToDelete?.username}?</p>
            <button className="modal-button cancel" onClick={handleConfirmDelete}>
              Confirm
            </button>
            <button className="modal-button confirm" onClick={handleCancelDelete}>
              Cancel
            </button>
            {message && <p className="modal-message">{message}</p>}
          </div>
        </div>
      )}
      
    </div>
  );
}
