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
    __id
    edges {
      node {
        ...TodoFragment
        task
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

  /* console.log(allTodos?.__id) */

  const todos = allTodos.edges
  console.log(allTodos)

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
    
       <CreateNew  /> 
    </>
  
    
  );
}

export default Todos;
