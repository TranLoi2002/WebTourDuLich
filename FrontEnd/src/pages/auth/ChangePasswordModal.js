import React, { useState } from "react";
import Modal from "react-modal";
import { TextField } from "@mui/material";
import { changePassword } from '../../api/auth.api';

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

        if (newPass !== confirmPass) {
            setError("Mật khẩu xác nhận không khớp");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            await changePassword({ oldPassword: oldPass, newPassword: newPass }, token);
            setMessage("Đổi mật khẩu thành công");
            setOldPass("");
            setNewPass("");
            setConfirmPass("");
            setTimeout(() => onClose(), 1000);
        } catch (err) {
            setError(err.error || "Đổi mật khẩu thất bại");
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
                    <h3>Update Password</h3>
                    <button
                        onClick={onClose}
                        className="bg-primary border-none py-[5px] px-[10px] outline-none text-white rounded-lg"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex flex-col gap-[30px] mt-[20px]">
                    <TextField
                        className="w-[80%]"
                        label="Current password"
                        type="password"
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                    />
                    <TextField
                        className="w-[80%]"
                        label="New password"
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                    />
                    <TextField
                        className="w-[80%]"
                        label="Confirm password"
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                    />
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {message && <div className="text-green-500 text-sm">{message}</div>}
                    <button
                        disabled={loading}
                        className="outline-none p-4 rounded-lg border-none bg-primary mt-[20px] text-white"
                        type="button"
                        onClick={handleChangePassword}
                    >
                        {loading ? "Đang xử lý..." : "Save Change"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ChangePasswordModal;