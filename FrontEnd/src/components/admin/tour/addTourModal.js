import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddTourModal = ({
                        isOpen,
                        onClose,
                        tourForm,
                        handleFormChange,
                        handleImagesChange,
                        handleRemoveImage,
                        handleAddTour,
                        tourTypes,
                        locations,
                        isAdding,
                      }) => {
  if (!isOpen) return null;

  // Custom handler for CKEditor changes
  const handleEditorChange = (name) => (event, editor) => {
    const data = editor.getData();
    handleFormChange({
      target: {
        name,
        value: data,
      },
    });
  };

  return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Tour</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title*</label>
                    <input
                        type="text"
                        name="title"
                        value={tourForm.title}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tour Type*</label>
                    <select
                        name="tourTypeId"
                        value={tourForm.tourTypeId || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
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
                        name="locationId"
                        value={tourForm.locationId || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
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
                    <label className="block text-sm font-medium text-gray-700">Price ($)*</label>
                    <input
                        type="number"
                        name="price"
                        value={tourForm.price}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Activity Tour</label>
                    <div className="mt-1 flexed items-center">
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
                          id="isActive-toggle"
                      />
                      <label
                          htmlFor="isActive-toggle"
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
                    <label className="block text-sm font-medium text-gray-700">Thumbnail*</label>
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/jpeg,image/png"
                        onChange={handleFormChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        required
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
                    <label className="block text-sm font-medium text-gray-700">Images</label>
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
                    <label className="block text-sm font-medium text-gray-700">Description*</label>
                    <div className="mt-1 border border-gray-300 rounded-md shadow-sm">
                      <CKEditor
                          editor={ClassicEditor}
                          data={tourForm.description}
                          onChange={handleEditorChange('description')}
                          config={{
                            toolbar: [
                              'heading',
                              '|',
                              'bold',
                              'italic',
                              'link',
                              'bulletedList',
                              'numberedList',
                              'blockQuote',
                              'undo',
                              'redo',
                            ],
                          }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Highlights</label>
                    <div className="mt-1 border border-gray-300 rounded-md shadow-sm">
                      <CKEditor
                          editor={ClassicEditor}
                          data={tourForm.highlights}
                          onChange={handleEditorChange('highlights')}
                          config={{
                            toolbar: [
                              'heading',
                              '|',
                              'bold',
                              'italic',
                              'link',
                              'bulletedList',
                              'numberedList',
                              'blockQuote',
                              'undo',
                              'redo',
                            ],
                          }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                  onClick={onClose}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                  onClick={handleAddTour}
                  disabled={
                      isAdding ||
                      !tourForm.title ||
                      !tourForm.placeOfDeparture ||
                      !tourForm.price ||
                      !tourForm.maxParticipants ||
                      !tourForm.startDate ||
                      !tourForm.endDate ||
                      !tourForm.thumbnail ||
                      !tourForm.locationId ||
                      !tourForm.tourTypeId ||
                      !tourForm.description
                  }
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                      isAdding ||
                      !tourForm.title ||
                      !tourForm.placeOfDeparture ||
                      !tourForm.price ||
                      !tourForm.maxParticipants ||
                      !tourForm.startDate ||
                      !tourForm.endDate ||
                      !tourForm.thumbnail ||
                      !tourForm.locationId ||
                      !tourForm.tourTypeId ||
                      !tourForm.description
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
              >
                {isAdding ? 'Adding...' : 'Add Tour'}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AddTourModal;