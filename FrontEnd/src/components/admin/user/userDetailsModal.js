import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const UserDetailsModal = ({
  isOpen,
  onClose,
  selectedUser,
  editMode,
  handleEditClick,
  handleStatusUpdate,
  handleSaveChanges,
}) => {
  const {
    register,
    handleSubmit,
    formState: { dirtyFields, isDirty, errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      userName: '',
      email: '',
      fullName: '',
      phoneNumber: '',
      role: 'USER',
      isActive: true,
      gender: 'MALE',
    },
    mode: 'onChange',
  });

  // Reset form when entering edit mode or when selected user changes
  useEffect(() => {
    if (selectedUser) {
      reset({
        userName: selectedUser.userName || '',
        email: selectedUser.email || '',
        fullName: selectedUser.fullName || '',
        phoneNumber: selectedUser.phoneNumber || '',
        role: selectedUser.role?.roleName || 'USER',
        isActive: selectedUser.isActive,
        gender: selectedUser.gender || 'MALE',
      });
    }
  }, [selectedUser, reset]);

  // Form submission handler
  const onSubmit = (data) => {
    handleSaveChanges(data);
  };

  // Check if form has changes that can be saved (only fullName and phoneNumber are editable)
  const hasChanges = dirtyFields.fullName || dirtyFields.phoneNumber || 
                     dirtyFields.role || dirtyFields.gender || dirtyFields.isActive;

  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">
              {editMode ? 'Edit User' : 'User Details'} - {selectedUser.userName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {editMode ? (
              <form onSubmit={handleSubmit(onSubmit)} className="contents">
                <div>
                  <h4 className="font-medium text-gray-900">Account Information</h4>
                  <div className="mt-2 space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        {...register('userName')}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-0"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email<span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('email')}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-0"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role<span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('role')}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-0"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Personal Information</h4>
                  <div className="mt-2 space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('fullName', {
                          required: 'Full name is required',
                          minLength: {
                            value: 2,
                            message: 'Full name must be at least 2 characters'
                          },
                          maxLength: {
                            value: 100,
                            message: 'Full name cannot exceed 100 characters'
                          },
                          pattern: {
                            value: /^[A-Za-z\s\u00C0-\u1EF9'-]+$/,
                            message: 'Full name can only contain letters, spaces, hyphens, and apostrophes'
                          }
                        })}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        } shadow-sm p-2 focus:outline-none focus:ring-0`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        {...register('phoneNumber', {
                          pattern: {
                            value: /^(\+?[0-9]{1,4}[-\s.]?)?(\([0-9]{1,5}\)[-\s.]?)?([0-9][-\s.]?){5,14}[0-9]$/,
                            message: 'Please enter a valid phone number'
                          },
                          minLength: {
                            value: 10,
                            message: 'Phone number must be 10 digits'
                          },
                          maxLength: {
                            value: 10,
                          }
                        })}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                        } shadow-sm p-2 focus:outline-none focus:ring-0`}
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Gender<span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('gender')}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-0"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status<span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('isActive')}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-0"
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <h4 className="font-medium text-gray-900">Account Information</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">ID:</span> {selectedUser.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Username:</span> {selectedUser.userName}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Email:</span> {selectedUser.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Role:</span>
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedUser.role?.roleName === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {selectedUser.role?.roleName || 'N/A'}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedUser.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedUser.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Personal Information</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Full Name:</span> {selectedUser.fullName || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Phone:</span>{' '}
                    {selectedUser.phoneNumber || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Gender:</span> {selectedUser.gender || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Created At:</span>{' '}
                    {selectedUser.createAt
                      ? new Date(selectedUser.createAt).toLocaleString()
                      : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Last Updated:</span>{' '}
                    {selectedUser.updateAt
                      ? new Date(selectedUser.updateAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-between">
            {!editMode ? (
              <>
                <button
                  onClick={handleEditClick}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-0"
                >
                  Edit User
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => handleStatusUpdate('ACTIVE')}
                    disabled={selectedUser.isActive}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-0 ${
                      selectedUser.isActive
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('INACTIVE')}
                    disabled={!selectedUser.isActive}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-0 ${
                      !selectedUser.isActive
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Deactivate
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-end space-x-2 w-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-0"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={!hasChanges || Object.keys(errors).length > 0}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-0 ${
                    hasChanges && Object.keys(errors).length === 0
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;