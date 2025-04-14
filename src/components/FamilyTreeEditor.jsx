// src/components/FamilyTreeEditor.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Tree from 'react-d3-tree';
import {
  getFamilyTree,
  getPersons,
  transformDataForTreeVisualization,
  addPerson,
  updatePerson,
  deletePerson
} from '../services/familyTreeService';
import {
  UserPlus,
  Edit,
  Trash,
  X,
  Save,
  ChevronLeft,
  Info,
  Settings
} from 'lucide-react';
import PersonForm from './PersonForm';
import PersonDetails from './PersonDetails';

function FamilyTreeEditor() {
  const { treeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const treeContainerRef = useRef(null);

  // Get highlighted person ID from URL query parameter
  const highlightedPersonId = new URLSearchParams(location.search).get('highlight');

  const [tree, setTree] = useState(null);
  const [persons, setPersons] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Helper function to split name into first and last name parts
  const splitName = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };

    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return { firstName: nameParts[0], lastName: '' };

    // Last word is assumed to be the last name
    const lastName = nameParts.pop();
    const firstName = nameParts.join(' ');

    return { firstName, lastName };
  };

  // Load tree and persons data
  useEffect(() => {
    const loadTreeData = async () => {
      try {
        setLoading(true);
        const treeData = await getFamilyTree(treeId);

        if (!treeData) {
          navigate('/');
          return;
        }

        setTree(treeData);

        const personsData = await getPersons(treeId);
        setPersons(personsData);

        if (personsData.length > 0) {
          const visualizationData = transformDataForTreeVisualization(personsData);
          setTreeData(visualizationData);

          // If a person ID was provided in the URL, select that person
          if (highlightedPersonId) {
            const highlightedPerson = personsData.find(p => p.id === highlightedPersonId);
            if (highlightedPerson) {
              setSelectedPerson(highlightedPerson);
            }
          }
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load family tree data');
        console.error(err);
        setLoading(false);
      }
    };

    loadTreeData();
  }, [treeId, navigate, highlightedPersonId]);

  // Get container dimensions for tree visualization
  useEffect(() => {
    if (treeContainerRef.current) {
      const { width, height } = treeContainerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }

    const handleResize = () => {
      if (treeContainerRef.current) {
        const { width, height } = treeContainerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Custom path component for the tree connections
  const renderCustomPathLink = ({ linkData, orientation }) => {
    const { source, target } = linkData;

    // Create link coordinates
    const sourceX = source.x;
    const sourceY = source.y;
    const targetX = target.x;
    const targetY = target.y;

    // Calculate midpoint for the right-angled path
    const midY = sourceY + (targetY - sourceY) / 2;

    // Define path with right angles
    return (
      <path
        d={`M${sourceX},${sourceY} L${sourceX},${midY} L${targetX},${midY} L${targetX},${targetY}`}
        fill="none"
        className="stroke-gray-400 stroke-2"
      />
    );
  };

  // Custom node renderer for the tree
  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    if (nodeDatum.isCouple) {
      // Render a couple node (husband and wife on the same line)
      return (
        <g>
          {/* Mother's box (left) */}
          <rect
            width="140"
            height="80"
            x="-150"
            y="-40"
            rx="5"
            className="fill-pink-100 stroke-pink-400 stroke-1"
            onClick={() => {
              const motherPerson = persons.find(p => p.id === nodeDatum.mother.id);
              if (motherPerson) handleNodeClick(motherPerson);
            }}
          />

          {/* Split mother's name for display */}
          {(() => {
            const { firstName, lastName } = splitName(nodeDatum.mother.name);
            return (
              <>
                <text
                  className="text-sm font-medium"
                  textAnchor="middle"
                  x="-80"
                  y="-20"
                  onClick={() => {
                    const motherPerson = persons.find(p => p.id === nodeDatum.mother.id);
                    if (motherPerson) handleNodeClick(motherPerson);
                  }}
                >
                  {firstName}
                </text>
                {lastName && (
                  <text
                    className="text-sm font-medium"
                    textAnchor="middle"
                    x="-80"
                    y="-5"
                    onClick={() => {
                      const motherPerson = persons.find(p => p.id === nodeDatum.mother.id);
                      if (motherPerson) handleNodeClick(motherPerson);
                    }}
                  >
                    {lastName}
                  </text>
                )}
              </>
            );
          })()}

          <text
            className="text-xs text-gray-600"
            textAnchor="middle"
            x="-80"
            y={nodeDatum.mother.name.split(' ').length > 2 ? "15" : "10"}
            onClick={() => {
              const motherPerson = persons.find(p => p.id === nodeDatum.mother.id);
              if (motherPerson) handleNodeClick(motherPerson);
            }}
          >
            {nodeDatum.mother.birthDate || ''}
          </text>
          <text
            className="text-xs text-gray-600"
            textAnchor="middle"
            x="-80"
            y={nodeDatum.mother.name.split(' ').length > 2 ? "30" : "25"}
            onClick={() => {
              const motherPerson = persons.find(p => p.id === nodeDatum.mother.id);
              if (motherPerson) handleNodeClick(motherPerson);
            }}
          >
            {nodeDatum.mother.birthPlace || ''}
          </text>

          {/* Connection line */}
          <path
            d="M -10,0 L 10,0"
            className="stroke-gray-400 stroke-2"
          />

          {/* Father's box (right) */}
          <rect
            width="140"
            height="80"
            x="10"
            y="-40"
            rx="5"
            className="fill-blue-100 stroke-blue-400 stroke-1"
            onClick={() => {
              const fatherPerson = persons.find(p => p.id === nodeDatum.father.id);
              if (fatherPerson) handleNodeClick(fatherPerson);
            }}
          />

          {/* Split father's name for display */}
          {(() => {
            const { firstName, lastName } = splitName(nodeDatum.father.name);
            return (
              <>
                <text
                  className="text-sm font-medium"
                  textAnchor="middle"
                  x="80"
                  y="-20"
                  onClick={() => {
                    const fatherPerson = persons.find(p => p.id === nodeDatum.father.id);
                    if (fatherPerson) handleNodeClick(fatherPerson);
                  }}
                >
                  {firstName}
                </text>
                {lastName && (
                  <text
                    className="text-sm font-medium"
                    textAnchor="middle"
                    x="80"
                    y="-5"
                    onClick={() => {
                      const fatherPerson = persons.find(p => p.id === nodeDatum.father.id);
                      if (fatherPerson) handleNodeClick(fatherPerson);
                    }}
                  >
                    {lastName}
                  </text>
                )}
              </>
            );
          })()}

          <text
            className="text-xs text-gray-600"
            textAnchor="middle"
            x="80"
            y={nodeDatum.father.name.split(' ').length > 2 ? "15" : "10"}
            onClick={() => {
              const fatherPerson = persons.find(p => p.id === nodeDatum.father.id);
              if (fatherPerson) handleNodeClick(fatherPerson);
            }}
          >
            {nodeDatum.father.birthDate || ''}
          </text>
          <text
            className="text-xs text-gray-600"
            textAnchor="middle"
            x="80"
            y={nodeDatum.father.name.split(' ').length > 2 ? "30" : "25"}
            onClick={() => {
              const fatherPerson = persons.find(p => p.id === nodeDatum.father.id);
              if (fatherPerson) handleNodeClick(fatherPerson);
            }}
          >
            {nodeDatum.father.birthPlace || ''}
          </text>
        </g>
      );
    } else if (nodeDatum.virtualNode) {
      // Render an invisible node (just for structure)
      return null;
    } else {
      // Regular person node
      const person = persons.find(p => p.id === nodeDatum.id);
      const isSelected = selectedPerson && selectedPerson.id === nodeDatum.id;
      const gender = person ? person.gender : 'other';

      // Split name for display
      const { firstName, lastName } = splitName(nodeDatum.name);

      return (
        <g onClick={() => handleNodeClick(person)}>
          <rect
            width="150"
            height="80"
            x="-75"
            y="-40"
            rx="5"
            className={`
              ${gender === 'male' ? 'fill-blue-100 stroke-blue-400' :
                gender === 'female' ? 'fill-pink-100 stroke-pink-400' :
                  'fill-purple-100 stroke-purple-400'}
              ${isSelected ? 'stroke-2' : 'stroke-1'}
            `}
          />
          <text
            className="text-sm font-medium"
            textAnchor="middle"
            dominantBaseline="middle"
            y="-20"
          >
            {firstName}
          </text>
          {lastName && (
            <text
              className="text-sm font-medium"
              textAnchor="middle"
              dominantBaseline="middle"
              y="-5"
            >
              {lastName}
            </text>
          )}
          <text
            className="text-xs text-gray-600"
            textAnchor="middle"
            dominantBaseline="middle"
            y={nodeDatum.name.split(' ').length > 2 ? "15" : "10"}
          >
            {person && person.birthDate ? person.birthDate : ''}
          </text>
          <text
            className="text-xs text-gray-600"
            textAnchor="middle"
            dominantBaseline="middle"
            y={nodeDatum.name.split(' ').length > 2 ? "30" : "25"}
          >
            {person && person.birthPlace ? person.birthPlace : ''}
          </text>
        </g>
      );
    }
  };

  const handleNodeClick = (person) => {
    setSelectedPerson(person);
    setIsEditing(false);
    setIsAddingPerson(false);
  };

  const handleAddPerson = async (personData) => {
    try {
      const newPerson = await addPerson(treeId, personData);
      setPersons([...persons, newPerson]);

      // Update tree data for visualization
      const updatedTreeData = transformDataForTreeVisualization([...persons, newPerson]);
      setTreeData(updatedTreeData);

      setIsAddingPerson(false);
    } catch (err) {
      setError('Failed to add person');
      console.error(err);
    }
  };

  const handleUpdatePerson = async (personData) => {
    try {
      await updatePerson(selectedPerson.id, personData);

      // Update persons array
      const updatedPersons = persons.map(p =>
        p.id === selectedPerson.id ? { ...p, ...personData } : p
      );
      setPersons(updatedPersons);

      // Update selected person
      setSelectedPerson({ ...selectedPerson, ...personData });

      // Update tree data for visualization
      const updatedTreeData = transformDataForTreeVisualization(updatedPersons);
      setTreeData(updatedTreeData);

      setIsEditing(false);
    } catch (err) {
      setError('Failed to update person');
      console.error(err);
    }
  };

  const handleDeletePerson = async () => {
    if (!confirm('Are you sure you want to delete this person? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePerson(selectedPerson.id);

      // Update persons array
      const updatedPersons = persons.filter(p => p.id !== selectedPerson.id);
      setPersons(updatedPersons);

      // Update tree data for visualization
      const updatedTreeData = transformDataForTreeVisualization(updatedPersons);
      setTreeData(updatedTreeData);

      setSelectedPerson(null);
    } catch (err) {
      setError('Failed to delete person');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[90vh] pt-16 flex flex-col">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">{tree?.name}</h1>
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Notification when coming from another tree */}
      {highlightedPersonId && selectedPerson && (
        <div className="p-4 mb-4 text-blue-700 bg-blue-100 rounded-md flex items-center">
          <Info size={20} className="mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">You're viewing a person linked from another family tree.</p>
            <p className="text-sm">
              This is a potential match for a person with the same name in a different tree.
              Information can be synchronized between linked persons.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
        {/* Left sidebar */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 md:col-span-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Family Members</h2>
            <button
              onClick={() => {
                setIsAddingPerson(true);
                setSelectedPerson(null);
                setIsEditing(false);
              }}
              className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <UserPlus size={16} className="mr-1" />
              Add Person
            </button>
          </div>

          <div className="space-y-2 mt-4">
            {persons.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No family members yet. Add a person to start building your family tree.
              </p>
            ) : (
              persons.map(person => (
                <div
                  key={person.id}
                  onClick={() => handleNodeClick(person)}
                  className={`
                    p-2 rounded-md cursor-pointer
                    ${selectedPerson && selectedPerson.id === person.id
                      ? 'bg-blue-100'
                      : 'hover:bg-gray-100'}
                  `}
                >
                  <div className="font-medium">
                    {person.firstName} {person.lastName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {person.birthDate || 'No birth date'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tree visualization */}
        <div
          ref={treeContainerRef}
          className="bg-white p-4 rounded-lg border border-gray-200 md:col-span-2 flex-grow relative"
        >
          {treeData ? (
            <Tree
              data={treeData}
              orientation="vertical"
              renderCustomNodeElement={renderCustomNode}
              renderCustomPathLink={renderCustomPathLink}
              translate={{ x: dimensions.width / 2, y: 100 }}
              nodeSize={{ x: 300, y: 200 }}
              separation={{ siblings: 0.8, nonSiblings: 2.5 }}
              pathFunc="step" // elbow, step, straight, diagonal
              pathClassFunc={() => ""}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Info size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-600 text-center mb-2">
                Your family tree is empty.
              </p>
              <p className="text-gray-500 text-center">
                Add family members to visualize your family tree.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Person details panel or form */}
      {(selectedPerson || isAddingPerson) && (
        <div className="fixed pt-18 inset-y-0 right-0 w-full md:w-1/3 lg:w-1/4 bg-white shadow-lg p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {isAddingPerson
                ? 'Add Family Member'
                : isEditing
                  ? 'Edit Family Member'
                  : 'Family Member Details'}
            </h2>
            <button
              onClick={() => {
                setSelectedPerson(null);
                setIsEditing(false);
                setIsAddingPerson(false);
              }}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {isAddingPerson ? (
            <PersonForm
              persons={persons}
              onSubmit={handleAddPerson}
              onCancel={() => setIsAddingPerson(false)}
            />
          ) : isEditing ? (
            <PersonForm
              persons={persons}
              initialData={selectedPerson}
              onSubmit={handleUpdatePerson}
              onCancel={() => setIsEditing(false)}
            />
          ) : selectedPerson && (
            <PersonDetails
              person={selectedPerson}
              persons={persons}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDeletePerson}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default FamilyTreeEditor;