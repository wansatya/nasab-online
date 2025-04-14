// src/components/PersonDetails.jsx
import { useState, useEffect } from 'react';
import { Edit2, Trash2, User, MapPin, Calendar, Briefcase } from 'lucide-react';

function PersonDetails({ person, persons, onEdit, onDelete }) {
  const mother = person.motherId ? persons.find(p => p.id === person.motherId) : null;
  const father = person.fatherId ? persons.find(p => p.id === person.fatherId) : null;
  const children = persons.filter(p => p.motherId === person.id || p.fatherId === person.id);

  // Format date from yyyy-mm-dd to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">
          {person.firstName} {person.lastName}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-start">
          <User className="mr-2 text-gray-500" size={18} />
          <div>
            <p className="text-sm font-medium text-gray-700">Gender</p>
            <p className="text-sm text-gray-600">
              {person.gender === 'male' ? 'Male' :
                person.gender === 'female' ? 'Female' : 'Other'}
            </p>
          </div>
        </div>

        {person.birthDate && (
          <div className="flex items-start">
            <Calendar className="mr-2 text-gray-500" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-700">Birth</p>
              <p className="text-sm text-gray-600">
                {formatDate(person.birthDate)}
                {person.birthPlace && ` in ${person.birthPlace}`}
              </p>
            </div>
          </div>
        )}

        {person.deathDate && (
          <div className="flex items-start">
            <Calendar className="mr-2 text-gray-500" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-700">Death</p>
              <p className="text-sm text-gray-600">
                {formatDate(person.deathDate)}
                {person.deathPlace && ` in ${person.deathPlace}`}
              </p>
            </div>
          </div>
        )}

        {person.occupation && (
          <div className="flex items-start">
            <Briefcase className="mr-2 text-gray-500" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-700">Occupation</p>
              <p className="text-sm text-gray-600">{person.occupation}</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Family</h3>

        <div className="space-y-3">
          {(mother || father) && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Parents</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                {mother && (
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-pink-400 mr-2"></div>
                    {mother.firstName} {mother.lastName} (Mother)
                  </li>
                )}
                {father && (
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                    {father.firstName} {father.lastName} (Father)
                  </li>
                )}
              </ul>
            </div>
          )}

          {children.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Children</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                {children.map(child => (
                  <li key={child.id} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${child.gender === 'male' ? 'bg-blue-400' :
                        child.gender === 'female' ? 'bg-pink-400' :
                          'bg-purple-400'
                      }`}></div>
                    {child.firstName} {child.lastName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {person.notes && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{person.notes}</p>
        </div>
      )}

      {/* Links to similar persons in other trees */}
      {person.linkedPersons && person.linkedPersons.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Potential Matches in Other Trees
          </h3>
          <ul className="text-sm text-gray-600 space-y-2 ml-4">
            {person.linkedPersons.map(linkedPerson => (
              <li key={linkedPerson.id} className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                <LinkToTree
                  treeId={linkedPerson.treeId}
                  personId={linkedPerson.id}
                  name={`${linkedPerson.firstName} ${linkedPerson.lastName}`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Component to display link to another tree with person details
function LinkToTree({ treeId, personId, name }) {
  const [treeDetails, setTreeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTreeDetails = async () => {
      try {
        const { getTreeDetails } = await import('../services/familyTreeService');
        const details = await getTreeDetails(treeId);
        setTreeDetails(details);
      } catch (error) {
        console.error("Error loading tree details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTreeDetails();
  }, [treeId]);

  if (isLoading) {
    return <span>{name} (loading tree details...)</span>;
  }

  if (!treeDetails) {
    return <span>{name} (tree not available)</span>;
  }

  return (
    <a
      href={`/tree/${treeId}?highlight=${personId}`}
      className="text-blue-600 hover:underline flex items-center"
    >
      {name} in tree "{treeDetails.name}"
    </a>
  );
}

export default PersonDetails;