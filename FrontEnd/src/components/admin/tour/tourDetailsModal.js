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
  handleRemoveImage,
  handleSaveChanges,
  tourTypes,
  locations,
  isUpdating,
}) => {
  if (!isOpen || !selectedTour) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-[90vw] w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 text-gray-500 hover:text-gray-700 transition-colors bg-white rounded-full p-2 shadow-md"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editMode ? 'Edit Tour' : 'Tour Details'} - {selectedTour.title}
            </h2>
          </div>

          <div className="space-y-6">
            {editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  <div className="space-y-4">
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
                        name="tourTypeId"
                        value={tourForm.tourTypeId || ''}
                        onChange={handleFormChange}
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
                        name="locationId"
                        value={tourForm.locationId || ''}
                        onChange={handleFormChange}
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
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Availability</h3>
                  <div className="space-y-4">
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
                      <label className="block text-sm font-medium text-gray-600">Activity Tour</label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="checkbox"
                          name="activityTour"
                          checked={tourForm.activityTour}
                          onChange={handleFormChange}
                          className="sr-only"
                          id="activityTour-toggle"
                        />
                        <label
                          htmlFor="activityTour-toggle"
                          className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-200 ease-in-out ${
                            tourForm.activityTour ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`absolute left-0 inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
                              tourForm.activityTour ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </label>
                        <span className="ml-3 text-sm text-gray-600">
                          {tourForm.activityTour ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Is Active</label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="checkbox"
                          name="active"
                          checked={tourForm.active}
                          onChange={handleFormChange}
                          className="sr-only"
                          id="active-toggle"
                        />
                        <label
                          htmlFor="active-toggle"
                          className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-200 ease-in-out ${
                            tourForm.active ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`absolute left-0 inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
                              tourForm.active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </label>
                        <span className="ml-3 text-sm text-gray-600">
                          {tourForm.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Media</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Thumbnail*</label>
                      <input
                        type="file"
                        name="thumbnail"
                        accept="image/jpeg,image/png"
                        onChange={handleFormChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {tourForm.thumbnail && (
                        <div className="mt-2">
                          <img
                            src={typeof tourForm.thumbnail === 'string' ? tourForm.thumbnail : URL.createObjectURL(tourForm.thumbnail)}
                            alt="Thumbnail Preview"
                            className="w-32 h-32 object-cover rounded-md shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Images</label>
                      <input
                        type="file"
                        name="images"
                        accept="image/jpeg,image/png"
                        multiple
                        onChange={handleImagesChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {tourForm.images?.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {tourForm.images.map((img, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                alt={`Image ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-md shadow-sm"
                              />
                              <button
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                              >
                                X
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Description & Highlights</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Description*</label>
                      <textarea
                        name="description"
                        value={tourForm.description}
                        onChange={handleFormChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Highlights</label>
                      <textarea
                        name="highlights"
                        value={tourForm.highlights}
                        onChange={handleFormChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 p-2 border text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Tour Image</h3>
                  <div className="flex justify-center">
                    <img
                      src={selectedTour.thumbnail}
                      alt="Thumbnail"
                      className="w-full max-w-md h-64 object-cover rounded-lg shadow-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                    <div className="space-y-3">
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
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Availability</h3>
                    <div className="space-y-3">
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
                            selectedTour.status === 'UPCOMING'
                              ? 'bg-blue-100 text-blue-800'
                              : selectedTour.status === 'ONGOING'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {selectedTour.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Activity Tour:</span>
                        <span
                          className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            selectedTour.activityTour
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {selectedTour.activityTour ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Is Active:</span>
                        <span
                          className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            selectedTour.active
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {selectedTour.active ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {selectedTour.images?.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedTour.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Image ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedTour.description && (
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                    <p className="text-sm text-gray-600">{selectedTour.description}</p>
                  </div>
                )}

                {selectedTour.highlights && (
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Highlights</h3>
                    <p className="text-sm text-gray-600">{selectedTour.highlights}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center">
            {!editMode ? (
              <div className="flex justify-end space-x-3 w-full">
                <button
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Edit Tour
                </button>
              </div>
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
                    !tourForm.locationId ||
                    !tourForm.tourTypeId
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
                    !tourForm.locationId ||
                    !tourForm.tourTypeId
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