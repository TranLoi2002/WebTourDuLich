import React from 'react';

const TourList = ({ tours, isLoading, handleTourClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Tour Code
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Tour Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Duration
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Price ($)
            </th>
            {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Active
            </th> */}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Participants
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Availability
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan="8" className="text-center py-8">
                <div className="flex justify-center">
                  <svg
                    className="animate-spin h-8 w-8 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                </div>
              </td>
            </tr>
          ) : tours.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-8">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tours found</h3>
                  <p className="mt-1 text-sm text-sm text-gray-500">Try changing your search or filter criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            tours.map((tour) => (
              <tr
                key={tour.id}
                onClick={() => handleTourClick(tour)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.tourCode}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                  <div className="text-sm text-gray-500">{tour.tourType?.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.placeOfDeparture}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tour.price}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                    {tour.active.toString()}
                </td> */}

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tour.status === 'UPCOMING'
                        ? 'bg-blue-100 text-blue-800'
                        : tour.status === 'ONGOING'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {tour.status}
                  </span>

                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tour.currentParticipants}/{tour.maxParticipants}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tour.startDate ? new Date(tour.startDate).toLocaleDateString() : 'N/A'} -{' '}
                  {tour.endDate ? new Date(tour.endDate).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TourList;