import React from 'react';
import logo from './logo.svg';
import './App.css';
import graphql from 'babel-plugin-relay/macro';
import { useLazyLoadQuery } from 'react-relay';

const AppQuery = graphql`
query AppQuery {
  allTodos {
    edges {
      node {
        completed
        dateCreated
        dateUpdated
        userUid
      }
    }
  }
}
`;

function App() {
  const data = useLazyLoadQuery(
    AppQuery,
    {},
  );
  console.log(data)
  return (
    <div className="App">
      hello world
    </div>
  );
}

export default App;
