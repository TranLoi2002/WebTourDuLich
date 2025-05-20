import React, { useState } from "react";
import Modal from "react-modal";
import { TextField } from "@mui/material";
import { changePassword } from "../../api/auth.api";
import { toast } from "react-toastify";

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    // Validate all fields
    if (!oldPass || !newPass || !confirmPass) {
        toast.info("Please fill in all fields");
        setLoading(false);
        return;
    }

    // Validate new password length
    if (newPass.length < 6) {
        toast.info("New password must be at least 6 characters long");
        setLoading(false);
        return;
    }

    // Check confirm password
    if (newPass !== confirmPass) {
        toast.info("New password and confirmation do not match");
        setLoading(false);
        return;
    }

    try {
        await changePassword({ oldPassword: oldPass, newPassword: newPass });

        toast.success("Password changed successfully");
        setOldPass("");
        setNewPass("");
        setConfirmPass("");

        setTimeout(() => {
            onClose();
        }, 1500);
    } catch (err) {
        if (err?.response?.status === 401) {
            toast.error("Session expired. Please log in again");
        } else if (err?.response?.data) {
            toast.error(err.response.data);
        } else {
            toast.error("An error occurred. Please try again");
        }
    } finally {
        setLoading(false);
    }
};

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                content: {
                    width: "30%",
                    margin: "100px auto",
                    padding: "20px",
                    borderRadius: "10px"
                }
            }}
        >
            <div className="modal-content">
                <div className="flex items-center justify-between">
                    <h3>Change Password</h3>
                    <button
                        onClick={onClose}
                        className="bg-primary border-none py-[5px] px-[10px] outline-none text-white rounded-lg"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex flex-col gap-[20px] mt-[20px]">
                    <TextField
                        className="w-full"
                        label="Current Password"
                        type="password"
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                    />
                    <TextField
                        className="w-full"
                        label="New Password"
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                    />
                    <TextField
                        className="w-full"
                        label="Confirm New Password"
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                    />
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {message && <div className="text-green-500 text-sm">{message}</div>}
                    <button
                        disabled={loading}
                        className="outline-none p-4 rounded-lg border-none bg-primary mt-[10px] text-white"
                        type="button"
                        onClick={handleChangePassword}
                    >
                        {loading ? "Processing..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </Modal>
    );

};

export default ChangePasswordModal;
