// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getFamilyTrees, createFamilyTree, deleteFamilyTree } from '../services/familyTreeService';
import { Plus, Trash2, Edit3, Users } from 'lucide-react';

function Dashboard() {
  const { currentUser } = useAuth();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTreeName, setNewTreeName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTrees = async () => {
      try {
        if (currentUser) {
          const userTrees = await getFamilyTrees(currentUser.uid);
          setTrees(userTrees);
        }
      } catch (err) {
        setError('Failed to load family trees');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTrees();
  }, [currentUser]);

  const handleCreateTree = async (e) => {
    e.preventDefault();
    if (!newTreeName.trim()) return;

    try {
      setIsCreating(true);
      const newTree = await createFamilyTree(currentUser.uid, newTreeName);
      setTrees([...trees, newTree]);
      setNewTreeName('');
      setIsCreating(false);
    } catch (err) {
      setError('Failed to create family tree');
      console.error(err);
      setIsCreating(false);
    }
  };

  const handleDeleteTree = async (treeId) => {
    if (!confirm('Are you sure you want to delete this family tree? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteFamilyTree(treeId);
      setTrees(trees.filter(tree => tree.id !== treeId));
    } catch (err) {
      setError('Failed to delete family tree');
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
    <div className="h-[90vh] pt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Family Trees</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          Create New
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {isCreating && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Create New Family Tree</h2>
          <form onSubmit={handleCreateTree} className="space-y-4">
            <div>
              <label htmlFor="treeName" className="block text-sm font-medium text-gray-700">
                Tree Name
              </label>
              <input
                type="text"
                id="treeName"
                value={newTreeName}
                onChange={(e) => setNewTreeName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="My Family Tree"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {trees.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Family Trees Yet</h2>
          <p className="text-gray-500 mb-4">Create your first family tree to get started.</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Family Tree
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map((tree) => (
            <div key={tree.id} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900">{tree.name}</h2>
                <div className="flex space-x-2">
                  <Link
                    to={`/tree/${tree.id}`}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit3 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDeleteTree(tree.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(tree.createdAt.seconds * 1000).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(tree.updatedAt.seconds * 1000).toLocaleDateString()}
              </p>
              <Link
                to={`/tree/${tree.id}`}
                className="mt-4 block text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Open Tree
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;