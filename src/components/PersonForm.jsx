// src/components/PersonForm.jsx
import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

function PersonForm({ initialData, persons, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'other',
    birthDate: '',
    birthPlace: '',
    deathDate: '',
    deathPlace: '',
    occupation: '',
    notes: '',
    motherId: '',
    fatherId: '',
    syncWithLinked: initialData?.linkedPersons?.length > 0 ? false : null // Only show option if there are linked persons
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Filter out current person from potential parents
  const potentialMothers = persons.filter(person =>
    person.gender === 'female' && (!initialData || person.id !== initialData.id)
  );

  const potentialFathers = persons.filter(person =>
    person.gender === 'male' && (!initialData || person.id !== initialData.id)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
          Birth Date
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700">
          Birth Place
        </label>
        <input
          type="text"
          id="birthPlace"
          name="birthPlace"
          value={formData.birthPlace || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="deathDate" className="block text-sm font-medium text-gray-700">
          Death Date
        </label>
        <input
          type="date"
          id="deathDate"
          name="deathDate"
          value={formData.deathDate || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="deathPlace" className="block text-sm font-medium text-gray-700">
          Death Place
        </label>
        <input
          type="text"
          id="deathPlace"
          name="deathPlace"
          value={formData.deathPlace || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
          Occupation
        </label>
        <input
          type="text"
          id="occupation"
          name="occupation"
          value={formData.occupation || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="motherId" className="block text-sm font-medium text-gray-700">
            Mother
          </label>
          <select
            id="motherId"
            name="motherId"
            value={formData.motherId || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None</option>
            {potentialMothers.map(person => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fatherId" className="block text-sm font-medium text-gray-700">
            Father
          </label>
          <select
            id="fatherId"
            name="fatherId"
            value={formData.fatherId || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None</option>
            {potentialFathers.map(person => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={2}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Sync with linked persons option */}
      {formData.syncWithLinked !== null && initialData?.linkedPersons?.length > 0 && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="syncWithLinked"
            name="syncWithLinked"
            checked={formData.syncWithLinked}
            onChange={(e) => handleChange({
              target: {
                name: 'syncWithLinked',
                value: e.target.checked
              }
            })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="syncWithLinked" className="ml-2 block text-sm text-gray-700">
            Sync changes with linked persons in other trees ({initialData?.linkedPersons?.length})
          </label>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          type="submit"
          className="flex items-center px-4 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Save size={18} className="mr-2" />
          {initialData ? 'Update' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-4 py-1 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          <X size={18} className="mr-2" />
          Cancel
        </button>
      </div>
    </form>
  );
}

export default PersonForm;