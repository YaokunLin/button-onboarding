import './App.css';
import graphql from 'babel-plugin-relay/macro';
import { ConnectionHandler, useFragment, useMutation } from 'react-relay';
import { TodoFragment$key } from './__generated__/TodoFragment.graphql';
import { RecordSourceSelectorProxy } from 'relay-runtime/lib/store/RelayStoreTypes';
import { useState } from 'react';
import { CreateNewFragment$key } from './__generated__/CreateNewFragment.graphql';

const CreateNewFragment = graphql`
  fragment CreateNewFragment on Todo {
    __id
    completed
    dateCreated
    dateUpdated
    nodeId
    task
    taskUid
  }
`;

const CreateNewMutation = graphql`
  mutation CreateNewMutation(
    $completed: Boolean!,
    $task: String!
  ) {
    createTodo(
      input: {todo: {completed: $completed, task:$task}}
    ) {
      todoEdge @prependEdge(connections: "TodosQuery_allTodos") {
        node {
          ...CreateNewFragment
        }
      }
    }
  }
`;

type Props = {
  createNewProp: CreateNewFragment$key;
  };


function CreateNew({createNewProp} : Props) {
  const fetchedTodo = useFragment(
    CreateNewFragment,
    createNewProp,
  );
  const [taskTxt, setTaskTxt] = useState("")

  const [commitMutation, isMutationInFlight] = useMutation(CreateNewMutation);
  function onPost() {
    setTaskTxt(''); 
    
    commitMutation({
      variables: {
        completed: false,
        task: taskTxt,
      },
      updater: (store: RecordSourceSelectorProxy, response: any) => {
        const payload = store.getRootField('createTodo');
        if (payload) {
          const newTodoEdge = payload.getLinkedRecord('todoEdge');
          const userRecord = store.getRoot();
          const todosConnection = ConnectionHandler.getConnection(userRecord, 'TodosQuery_allTodos');
      
          if (todosConnection && newTodoEdge) {
            ConnectionHandler.insertEdgeBefore(todosConnection, newTodoEdge);
          }
        }
      }
    })
  }

  
  



  return (
          <>
            
            <input 
              type="text" 
              value={taskTxt}
              onChange={(evt)=>setTaskTxt(evt.target.value)}
              disabled={isMutationInFlight}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  onPost();
                }
              }}
            />

            <button 
              onClick={onPost}
              disabled={isMutationInFlight}
              > 
              create todo
            </button>
          </>

          
  
  );
}

export default CreateNew;
