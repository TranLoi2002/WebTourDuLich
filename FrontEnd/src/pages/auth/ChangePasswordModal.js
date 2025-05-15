import React, { useState } from "react";
import Modal from "react-modal";
import { TextField } from "@mui/material";
import { changePassword } from "../../api/auth.api";

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

        if (!oldPass || !newPass || !confirmPass) {
            setError("Vui lòng điền đầy đủ thông tin.");
            setLoading(false);
            return;
        }

        if (newPass !== confirmPass) {
            setError("Mật khẩu xác nhận không khớp.");
            setLoading(false);
            return;
        }

        try {
            await changePassword({ oldPassword: oldPass, newPassword: newPass });

            setMessage("Đổi mật khẩu thành công.");
            setOldPass("");
            setNewPass("");
            setConfirmPass("");

            setTimeout(() => {
                setMessage("");
                onClose();
            }, 1500);
        } catch (err) {
            if (err?.response?.status === 401) {
                setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            } else if (err?.response?.data) {
                setError(err.response.data);
            } else {
                setError("Đã xảy ra lỗi. Vui lòng thử lại.");
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
                    <h3>Đổi mật khẩu</h3>
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
                        label="Mật khẩu hiện tại"
                        type="password"
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                    />
                    <TextField
                        className="w-full"
                        label="Mật khẩu mới"
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                    />
                    <TextField
                        className="w-full"
                        label="Xác nhận mật khẩu mới"
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
                        {loading ? "Đang xử lý..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ChangePasswordModal;
