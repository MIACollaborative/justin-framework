import { createContext, useState, useEffect } from 'react';
// import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  // const [participants, setParticipants] = useState([]);
  // const [search, setSearch] = useState('');
  // const [searchResults, setSearchResults] = useState([]);
  // const { data, fetchError, isLoading } = useAxiosFetch('/users/participants/');

  const [currParticipantId, setCurrParticipantId] = useState();

  // useEffect(() => {
  //   setParticipants(data);
  // }, [data]);

  // useEffect(() => {
  //   const filteredResults = participants.filter(
  //     (participant) =>
  //       participant.username.toLowerCase().includes(search.toLowerCase()) ||
  //       participant.whatsappNum.toLowerCase().includes(search.toLowerCase())
  //   );

  //   setSearchResults(filteredResults.reverse());
  // }, [participants, search]);

  return (
    <DataContext.Provider
      value={{
        // search,
        // setSearch,
        // searchResults,
        // fetchError,
        // isLoading,
        // participants,
        // setParticipants,
        currParticipantId,
        setCurrParticipantId
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
