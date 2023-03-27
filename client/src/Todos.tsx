import React from 'react';
import './App.css';
import graphql from 'babel-plugin-relay/macro';
import { useLazyLoadQuery } from 'react-relay';
import type {TodosQuery as TodosQueryType} from './__generated__/TodosQuery.graphql';
import Todo from './Todo';
import CreateNew from './CreateNew';


const TodosQuery = graphql`
query TodosQuery($count: Int)  
{
  allTodos(first: $count) @connection(key: "TodosQuery_allTodos") {
    edges {
      node {
        ...TodoFragment
        ...CreateNewFragment
      }
    }
  }
}
`;

function Todos() {
  const data = useLazyLoadQuery<TodosQueryType>(
    TodosQuery,
    {count: 100},
  );
  const allTodos = data.allTodos;

  if (allTodos == null){
    return <>no more todos</>
  }

  const todos = allTodos.edges
  console.log(data)

  return (
    <>

      <table style={{width:"100%"}}>

      <tr>
        <th></th>
        <th>isCompleted/task</th>
      </tr>

        {todos?.map(todo => {
          if(todo.node){
            return <Todo todoProp={todo.node}/>
          }
          return <></>
        })}

      </table>
    
       {todos[0].node && <CreateNew createNewProp={todos[0]?.node}  /> }
    </>
  
    
  );
}

export default Todos;
