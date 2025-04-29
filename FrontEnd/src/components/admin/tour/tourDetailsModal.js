import React from 'react';

const TourDetailsModal = ({
  isOpen,
  onClose,
  selectedTour,
  editMode,
  setEditMode,
  tourForm,
  handleFormChange,
  handleImagesChange,
  handleSaveChanges,
  handleStatusUpdate,
  tourTypes,
  locations,
  isUpdating,
}) => {
  if (!isOpen || !selectedTour) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-10">
      {/* Overlay trong suốt, không khóa scroll bên ngoài */}
      <div
        className="absolute inset-0 bg-gray-600 bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {editMode ? 'Edit Tour' : 'Tour Details'} - {selectedTour.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nội dung modal */}
          <div className="space-y-6">
            {editMode ? (
              <>
                {/* Form chỉnh sửa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-800">Basic Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Tour Code</label>
                      <input
                        type="text"
                        name="tourCode"
                        value={tourForm.tourCode}
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 border text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Title*</label>
                      <input
                        type="text"
                        name="title"
                        value={tourForm.title}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Place of Departure*</label>
                      <input
                        type="text"
                        name="placeOfDeparture"
                        value={tourForm.placeOfDeparture}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Duration*</label>
                      <input
                        type="text"
                        name="duration"
                        value={tourForm.duration}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Tour Type*</label>
                      <select
                        name="tourType"
                        value={tourForm.tourType?.id || ''}
                        onChange={(e) =>
                          handleFormChange({
                            target: { name: 'tourType', value: { id: e.target.value } },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select Tour Type</option>
                        {tourTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Location*</label>
                      <select
                        name="location"
                        value={tourForm.location?.id || ''}
                        onChange={(e) =>
                          handleFormChange({
                            target: { name: 'location', value: { id: e.target.value } },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select Location</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pricing & Availability */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-800">Pricing & Availability</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Price ($)*</label>
                      <input
                        type="number"
                        name="price"
                        value={tourForm.price}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={tourForm.discount}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Max Participants*</label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={tourForm.maxParticipants}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Start Date*</label>
                      <input
                        type="date"
                        name="startDate"
                        value={tourForm.startDate}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">End Date*</label>
                      <input
                        type="date"
                        name="endDate"
                        value={tourForm.endDate}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Status*</label>
                      <select
                        name="status"
                        value={tourForm.status}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-lg font-medium text-gray-800">Media</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Thumbnail URL*</label>
                      <input
                        type="url"
                        name="thumbnail"
                        value={tourForm.thumbnail}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Images (comma-separated URLs)
                      </label>
                      <input
                        type="text"
                        name="images"
                        value={tourForm.images.join(',')}
                        onChange={handleImagesChange}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://example.com/image1.jpg,https://example.com/image2.jpg"
                      />
                    </div>
                  </div>

                  {/* Description & Highlights */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-lg font-medium text-gray-800">Description*</h4>
                    <textarea
                      name="description"
                      value={tourForm.description}
                      onChange={handleFormChange}
                      rows="3"
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <h4 className="text-lg font-medium text-gray-800">Highlights</h4>
                    <textarea
                      name="highlights"
                      value={tourForm.highlights}
                      onChange={handleFormChange}
                      rows="3"
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Chế độ xem chi tiết */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Basic Information</h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tour Code:</span> {selectedTour.tourCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Title:</span> {selectedTour.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Place of Departure:</span>{' '}
                      {selectedTour.placeOfDeparture}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Duration:</span> {selectedTour.duration}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tour Type:</span> {selectedTour.tourType?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {selectedTour.location?.name || 'N/A'}
                    </p>
                  </div>

                  {/* Pricing & Availability */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Pricing & Availability</h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Price:</span> ${selectedTour.price}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Discount:</span> {selectedTour.discount}%
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Participants:</span>{' '}
                      {selectedTour.currentParticipants}/{selectedTour.maxParticipants}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Available From:</span>{' '}
                      {selectedTour.startDate
                        ? new Date(selectedTour.startDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Available To:</span>{' '}
                      {selectedTour.endDate
                        ? new Date(selectedTour.endDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedTour.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {selectedTour.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </p>
                  </div>

                  {/* Media */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-lg font-medium text-gray-800">Media</h4>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Thumbnail:</p>
                      <img
                        src={selectedTour.thumbnail}
                        alt="Thumbnail"
                        className="w-full max-w-md h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                    </div>
                    {selectedTour.images?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Images:</p>
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                          {selectedTour.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Image ${idx + 1}`}
                              className="w-32 h-24 object-cover rounded-lg shadow hover:shadow-lg transition-shadow"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {selectedTour.description && (
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-medium text-gray-800">Description</h4>
                      <p className="mt-1 text-sm text-gray-600">{selectedTour.description}</p>
                    </div>
                  )}

                  {/* Highlights */}
                  {selectedTour.highlights && (
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-medium text-gray-800">Highlights</h4>
                      <p className="mt-1 text-sm text-gray-600">{selectedTour.highlights}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Nút điều khiển */}
          <div className="mt-8 flex justify-between items-center">
            {!editMode ? (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Edit Tour
                </button>
                <div className="space-x-3">
                  <button
                    onClick={() => handleStatusUpdate('ACTIVE')}
                    disabled={selectedTour.active || isUpdating}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white transition-colors ${
                      selectedTour.active || isUpdating
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isUpdating && !selectedTour.active ? 'Activating...' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('INACTIVE')}
                    disabled={!selectedTour.active || isUpdating}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white transition-colors ${
                      !selectedTour.active || isUpdating
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isUpdating && selectedTour.active ? 'Deactivating...' : 'Deactivate'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-end space-x-3 w-full">
                <button
                  onClick={() => setEditMode(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={
                    isUpdating ||
                    !tourForm.title ||
                    !tourForm.placeOfDeparture ||
                    !tourForm.duration ||
                    !tourForm.price ||
                    !tourForm.maxParticipants ||
                    !tourForm.startDate ||
                    !tourForm.endDate ||
                    !tourForm.thumbnail ||
                    !tourForm.location ||
                    !tourForm.tourType
                  }
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white transition-colors ${
                    isUpdating ||
                    !tourForm.title ||
                    !tourForm.placeOfDeparture ||
                    !tourForm.duration ||
                    !tourForm.price ||
                    !tourForm.maxParticipants ||
                    !tourForm.startDate ||
                    !tourForm.endDate ||
                    !tourForm.thumbnail ||
                    !tourForm.location ||
                    !tourForm.tourType
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailsModal;