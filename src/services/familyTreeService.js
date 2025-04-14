// src/services/familyTreeService.js
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

const treesCollection = collection(db, 'familyTrees');
const personsCollection = collection(db, 'persons');

// Tree operations
export const createFamilyTree = async (userId, treeName) => {
  const newTree = {
    name: treeName,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const docRef = await addDoc(treesCollection, newTree);
  return { id: docRef.id, ...newTree };
};

export const getFamilyTrees = async (userId) => {
  const q = query(treesCollection, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getFamilyTree = async (treeId) => {
  const docRef = doc(treesCollection, treeId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const updateFamilyTree = async (treeId, data) => {
  const docRef = doc(treesCollection, treeId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date()
  });
};

export const deleteFamilyTree = async (treeId) => {
  const docRef = doc(treesCollection, treeId);
  await deleteDoc(docRef);

  // Also delete all persons in the tree
  const personsQuery = query(personsCollection, where('treeId', '==', treeId));
  const snapshot = await getDocs(personsQuery);

  const deletePromises = snapshot.docs.map(document =>
    deleteDoc(doc(personsCollection, document.id))
  );

  await Promise.all(deletePromises);
};

// Person operations
export const addPerson = async (treeId, personData) => {
  const newPerson = {
    treeId,
    ...personData,
    createdAt: new Date(),
    updatedAt: new Date(),
    linkedPersons: [] // Array to store links to similar persons in other trees
  };

  const docRef = await addDoc(personsCollection, newPerson);

  // Find potential matches in other trees
  await findAndLinkSimilarPersons({ id: docRef.id, ...newPerson });

  return { id: docRef.id, ...newPerson };
};

export const getPersons = async (treeId) => {
  const q = query(personsCollection, where('treeId', '==', treeId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getPerson = async (personId) => {
  const docRef = doc(personsCollection, personId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const updatePerson = async (personId, data) => {
  const docRef = doc(personsCollection, personId);

  // Extract syncWithLinked from the data (we don't want to store this in Firestore)
  const { syncWithLinked, ...personData } = data;

  // Update the person
  await updateDoc(docRef, {
    ...personData,
    updatedAt: new Date()
  });

  // If syncWithLinked is true, update all linked persons
  if (syncWithLinked) {
    // First, get the current person data to access linkedPersons
    const personDoc = await getDoc(docRef);

    if (personDoc.exists() && personDoc.data().linkedPersons) {
      const linkedPersons = personDoc.data().linkedPersons;

      // Fields to sync with linked persons (excluding relationships and tree-specific data)
      const syncFields = {
        birthDate: personData.birthDate,
        birthPlace: personData.birthPlace,
        deathDate: personData.deathDate,
        deathPlace: personData.deathPlace,
        occupation: personData.occupation,
        gender: personData.gender
        // Note: We don't sync firstName, lastName because that would break the linking mechanism
        // We also don't sync motherId, fatherId as those are tree-specific
      };

      // Update each linked person
      for (const linkedPerson of linkedPersons) {
        const linkedPersonRef = doc(personsCollection, linkedPerson.id);
        await updateDoc(linkedPersonRef, {
          ...syncFields,
          updatedAt: new Date()
        });
      }
    }
  }
};

export const deletePerson = async (personId) => {
  const docRef = doc(personsCollection, personId);
  await deleteDoc(docRef);
};

// Transform data for tree visualization
// Find persons with the same name across all trees
export const findPersonsByName = async (firstName, lastName, birthPlace, birthDate) => {
  const q = query(
    personsCollection,
    where('firstName', '==', firstName),
    where('lastName', '==', lastName),
    where('birthPlace', '==', birthPlace),
    where('birthDate', '==', birthDate)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Find and link similar persons across trees
export const findAndLinkSimilarPersons = async (person) => {
  // Skip if person doesn't have both first and last name
  if (!person.firstName || !person.lastName || !person.birthPlace || !person.birthDate) return;

  // Find all persons with the same name
  const similarPersons = await findPersonsByName(person.firstName, person.lastName, person.birthPlace, person.birthDate);

  // Filter out the current person and persons from the same tree
  const externalMatches = similarPersons.filter(p =>
    p.id !== person.id && p.treeId !== person.treeId
  );

  if (externalMatches.length === 0) return;

  // Create links between the person and matches
  const personRef = doc(personsCollection, person.id);

  // Add links to the current person
  await updateDoc(personRef, {
    linkedPersons: externalMatches.map(match => ({
      id: match.id,
      treeId: match.treeId,
      firstName: match.firstName,
      lastName: match.lastName
    }))
  });

  // Add link back from each matched person to this person
  for (const match of externalMatches) {
    const matchRef = doc(personsCollection, match.id);
    const matchDoc = await getDoc(matchRef);

    if (matchDoc.exists()) {
      const existingLinks = matchDoc.data().linkedPersons || [];

      // Check if link already exists
      const linkExists = existingLinks.some(link => link.id === person.id);

      if (!linkExists) {
        // Add new link
        await updateDoc(matchRef, {
          linkedPersons: [
            ...existingLinks,
            {
              id: person.id,
              treeId: person.treeId,
              firstName: person.firstName,
              lastName: person.lastName
            }
          ]
        });
      }
    }
  }
};

// Get tree details by ID
export const getTreeDetails = async (treeId) => {
  const treeRef = doc(treesCollection, treeId);
  const treeDoc = await getDoc(treeRef);

  if (!treeDoc.exists()) return null;

  return {
    id: treeDoc.id,
    ...treeDoc.data()
  };
};

// Transform data for tree visualization with couples displayed together
export const transformDataForTreeVisualization = (persons) => {
  // Find all unique couples (pairs of mother and father)
  const couples = [];
  const personMap = {};

  // Create a map of all persons by ID for easy lookup
  persons.forEach(person => {
    personMap[person.id] = person;
  });

  // Find all couples and their children
  persons.forEach(person => {
    const motherId = person.motherId;
    const fatherId = person.fatherId;

    if (motherId && fatherId) {
      // Check if this couple is already in our list
      const existingCouple = couples.find(c =>
        (c.motherId === motherId && c.fatherId === fatherId)
      );

      if (!existingCouple) {
        // Create a new couple
        couples.push({
          motherId,
          fatherId,
          children: [person.id]
        });
      } else {
        // Add this child to the existing couple
        existingCouple.children.push(person.id);
      }
    }
  });

  // Find root couples (where neither mother nor father has parents in the tree)
  let rootCouples = couples.filter(couple => {
    const mother = personMap[couple.motherId];
    const father = personMap[couple.fatherId];

    const motherHasParents = mother && (mother.motherId || mother.fatherId);
    const fatherHasParents = father && (father.motherId || father.fatherId);

    return !motherHasParents && !fatherHasParents;
  });

  // If no root couples found, find individuals without parents
  let rootNodes = [];
  if (rootCouples.length === 0) {
    const rootPersons = persons.filter(p => !p.motherId && !p.fatherId);

    if (rootPersons.length > 0) {
      // Create nodes for these root individuals
      rootNodes = rootPersons.map(person => buildPersonNode(person, persons, personMap, couples));
    } else if (persons.length > 0) {
      // If still no roots found, just use the first person
      rootNodes = [buildPersonNode(persons[0], persons, personMap, couples)];
    }
  } else {
    // Build tree starting from root couples
    rootNodes = rootCouples.map(couple =>
      buildCoupleNode(personMap[couple.motherId], personMap[couple.fatherId], persons, personMap, couples)
    );
  }

  if (rootNodes.length === 0) return null;

  // If multiple root nodes, create a virtual root to hold them all
  if (rootNodes.length > 1) {
    return {
      name: "Family Root",
      id: "root",
      virtualNode: true,
      children: rootNodes
    };
  }

  return rootNodes[0];
};

// Build a node representing a couple (husband and wife)
const buildCoupleNode = (mother, father, allPersons, personMap, couples) => {
  if (!mother || !father) return null;

  // Find children of this couple
  const coupleEntry = couples.find(c => c.motherId === mother.id && c.fatherId === father.id);
  const childrenIds = coupleEntry ? coupleEntry.children : [];

  const children = childrenIds
    .map(id => personMap[id])
    .filter(Boolean)
    .map(child => {
      // Check if child forms a couple with someone
      const childCouples = couples.filter(c =>
        c.motherId === child.id || c.fatherId === child.id
      );

      if (childCouples.length > 0) {
        // Child is part of a couple, create a couple node
        const childCouple = childCouples[0];
        const spouse = childCouple.motherId === child.id
          ? personMap[childCouple.fatherId]
          : personMap[childCouple.motherId];

        if (child.gender === 'female') {
          return buildCoupleNode(child, spouse, allPersons, personMap, couples);
        } else {
          return buildCoupleNode(spouse, child, allPersons, personMap, couples);
        }
      } else {
        // Child is not part of a couple, create a person node
        return buildPersonNode(child, allPersons, personMap, couples);
      }
    });

  // Create a couple node with both husband and wife information
  return {
    name: `${mother.firstName} & ${father.firstName}`,
    id: `couple-${mother.id}-${father.id}`,
    isCouple: true,
    mother: {
      id: mother.id,
      name: `${mother.firstName} ${mother.lastName}`,
      birthDate: mother.birthDate,
      birthPlace: mother.birthPlace,
      gender: mother.gender
    },
    father: {
      id: father.id,
      name: `${father.firstName} ${father.lastName}`,
      birthDate: father.birthDate,
      birthPlace: father.birthPlace,
      gender: father.gender
    },
    children: children.length > 0 ? children : undefined
  };
};

// Build a node for an individual person
const buildPersonNode = (person, allPersons, personMap, couples) => {
  if (!person) return null;

  // Find all children where this person is the mother or father
  let childrenNodes = [];

  // If this is a male, check if he's part of any couples
  if (person.gender === 'male') {
    const personCouples = couples.filter(c => c.fatherId === person.id);

    personCouples.forEach(couple => {
      const mother = personMap[couple.motherId];
      if (mother) {
        const coupleNode = buildCoupleNode(mother, person, allPersons, personMap, couples);
        if (coupleNode) {
          childrenNodes.push(coupleNode);
        }
      }
    });
  }

  // If this is a female, check if she's part of any couples
  if (person.gender === 'female') {
    const personCouples = couples.filter(c => c.motherId === person.id);

    personCouples.forEach(couple => {
      const father = personMap[couple.fatherId];
      if (father) {
        const coupleNode = buildCoupleNode(person, father, allPersons, personMap, couples);
        if (coupleNode) {
          childrenNodes.push(coupleNode);
        }
      }
    });
  }

  // If no couples found, check for children with only this parent
  if (childrenNodes.length === 0) {
    const children = allPersons.filter(p =>
      (person.gender === 'male' && p.fatherId === person.id && !p.motherId) ||
      (person.gender === 'female' && p.motherId === person.id && !p.fatherId)
    );

    childrenNodes = children.map(child => buildPersonNode(child, allPersons, personMap, couples));
  }

  // Create node with attributes
  const node = {
    name: `${person.firstName} ${person.lastName}`,
    id: person.id,
    attributes: {
      gender: person.gender,
      birthDate: person.birthDate,
      birthPlace: person.birthPlace,
      deathDate: person.deathDate || '',
      occupation: person.occupation || '',
      ...person // Include all other data
    }
  };

  // Add children nodes if they exist
  if (childrenNodes.length > 0) {
    node.children = childrenNodes;
  }

  return node;
};