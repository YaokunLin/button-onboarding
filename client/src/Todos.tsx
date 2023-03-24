import React from 'react';
import './App.css';
import graphql from 'babel-plugin-relay/macro';
import { useLazyLoadQuery } from 'react-relay';
import type {TodosQuery as TodosQueryType} from './__generated__/TodosQuery.graphql';
import Todo from './Todo';

const TodosQuery = graphql`
query TodosQuery {
  allTodos {
    edges {
      node {
        ...TodoFragment
      }
    }
  }
}
`;

function Todos() {
  const data = useLazyLoadQuery<TodosQueryType>(
    TodosQuery,
    {},
  );
  const allTodos = data.allTodos;

  if (allTodos == null){
    return <>no more todos</>
  }

  const todos = allTodos.edges
  console.log(todos);
  return (
    <table style={{width:"100%"}}>

    <tr>
      <th>isCompleted</th>
      <th>task</th>
    </tr>

      {todos?.map(todo => {
        if(todo && todo.node){
          return <Todo todoProp={todo.node}/>
        }

        return <></>
      })}

    </table>
  );
}

export default Todos;
