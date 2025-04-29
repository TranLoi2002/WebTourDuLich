import React from 'react';

const AddTourModal = ({
  isOpen,
  onClose,
  tourForm,
  handleFormChange,
  handleImagesChange,
  handleAddTour,
  tourTypes,
  locations,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">Add New Tour</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Basic Information</h4>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tour Code*</label>
                  <input
                    type="text"
                    name="tourCode"
                    value={tourForm.tourCode}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={tourForm.title}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Place of Departure*</label>
                  <input
                    type="text"
                    name="placeOfDeparture"
                    value={tourForm.placeOfDeparture}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration*</label>
                  <input
                    type="text"
                    name="duration"
                    value={tourForm.duration}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tour Type*</label>
                  <select
                    name="tourType"
                    value={tourForm.tourType?.id || ''}
                    onChange={(e) =>
                      handleFormChange({
                        target: { name: 'tourType', value: { id: e.target.value } },
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
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
                  <label className="block text-sm font-medium text-gray-700">Location*</label>
                  <select
                    name="location"
                    value={tourForm.location?.id || ''}
                    onChange={(e) =>
                      handleFormChange({
                        target: { name: 'location', value: { id: e.target.value } },
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
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
            <div>
              <h4 className="font-medium text-gray-900">Pricing & Availability</h4>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)*</label>
                  <input
                    type="number"
                    name="price"
                    value={tourForm.price}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={tourForm.discount}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Participants*</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={tourForm.maxParticipants}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Participants</label>
                  <input
                    type="number"
                    name="currentParticipants"
                    value={tourForm.currentParticipants}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date*</label>
                  <input
                    type="date"
                    name="startDate"
                    value={tourForm.startDate}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date*</label>
                  <input
                    type="date"
                    name="endDate"
                    value={tourForm.endDate}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status*</label>
                  <select
                    name="status"
                    value={tourForm.status}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900">Media</h4>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thumbnail URL*</label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={tourForm.thumbnail}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Images (comma-separated URLs)</label>
                  <input
                    type="text"
                    name="images"
                    value={tourForm.images.join(',')}
                    onChange={handleImagesChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    placeholder="https://example.com/image1.jpg,https://example.com/image2.jpg"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900">Description*</h4>
              <textarea
                name="description"
                value={tourForm.description}
                onChange={handleFormChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900">Highlights</h4>
              <textarea
                name="highlights"
                value={tourForm.highlights}
                onChange={handleFormChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="activityTour"
                  checked={tourForm.activityTour}
                  onChange={handleFormChange}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Is Activity Tour</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTour}
              disabled={
                !tourForm.tourCode ||
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
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                !tourForm.tourCode ||
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
              Add Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTourModal;