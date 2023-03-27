import './App.css';
import graphql from 'babel-plugin-relay/macro';
import { ConnectionHandler, useFragment, useMutation } from 'react-relay';
import { TodoFragment$key } from './__generated__/TodoFragment.graphql';
import { RecordSourceSelectorProxy } from 'relay-runtime/lib/store/RelayStoreTypes';
import { useState } from 'react';
import { DeleteTodoMutation } from './mutations/DeleteTodoMutation';

const TodoFragment = graphql`
  fragment TodoFragment on Todo {
    __id
    taskUid
    completed
    dateCreated
    dateUpdated
    userUid
    task
  }
`;

const TodoMutation = graphql`
  mutation TodoMutation(
    $taskUid: UUID!,
    $completed: Boolean!,
    $task: String!,

  ) @raw_response_type {
    updateTodoByTaskUid(
      input: {todoPatch: {completed: $completed, task:$task}, taskUid: $taskUid}
    ) {
      todo {
        ...TodoFragment
      }
    }
  }
`;



type Props = {
  todoProp: TodoFragment$key;
  };


function Todo({todoProp} : Props) {
  const fetchedTodo = useFragment(
    TodoFragment,
    todoProp,
  );
  const [commitMutation, isMutationInFlight] = useMutation(TodoMutation);
  const [taskTxt, setTaskTxt] = useState(fetchedTodo.task);
  const [isCompleted, setIsCompleted] = useState(fetchedTodo.completed);
  const [deleteMutation, isDeleteMutationInFlight] = useMutation(DeleteTodoMutation);
  const handleOnChange = () => commitMutation({
    variables: {
      taskUid: fetchedTodo.taskUid,
      completed: isCompleted,
      task: taskTxt,
    },
    updater: (store: RecordSourceSelectorProxy, response: any) => {
      console.log("updated")
      const payload = store.getRootField('updateTodoByTaskUid');
      if (payload && fetchedTodo) {
        const updatedTodo = payload.getLinkedRecord('todo');
   
        if (updatedTodo && fetchedTodo.__id) {
          const cachedTodo = store.get(fetchedTodo.__id);
       
          if (cachedTodo) {
            cachedTodo.copyFieldsFrom(updatedTodo);
          }
        }
      }
    },
  })


 

  const handleDelete = () => {
    deleteMutation({
      variables: {
        taskUid: fetchedTodo.taskUid,
      },
      updater: (store: RecordSourceSelectorProxy) => {
        const userRecord = store.getRoot();
        const todosConnection = ConnectionHandler.getConnection(userRecord, 'TodosQuery_allTodos');
        console.log(fetchedTodo.__id)

        if (todosConnection) {
          ConnectionHandler.deleteNode(todosConnection, fetchedTodo.__id);
        }
      },
    });
  };


  return (
    <tr style={{background:fetchedTodo.completed? "green": "red"}}>
       <th>
          {taskTxt}    
      </th>
      <th>
        <input 
              type="checkbox" 
              name={fetchedTodo.task} 
              checked={isCompleted ? true : false} 
              onChange={(e) => setIsCompleted(v=>!v)}
              disabled={isMutationInFlight}
        />
     
          <input 
            type="text" 
            value={taskTxt}
            onChange={(evt)=>setTaskTxt(evt.target.value)}
            disabled={isMutationInFlight}
          />

          <button 
            onClick={handleOnChange}
            disabled={isMutationInFlight}
            >
              Update
          </button>
      </th>

      

      <th>
          <button 
            onClick={handleDelete}
            disabled={isDeleteMutationInFlight}
            >
              X
          </button>
      </th>
      
      
      
    </tr>
  );
}

export default Todo;
