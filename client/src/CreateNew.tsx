import './App.css';
import graphql from 'babel-plugin-relay/macro';
import { ConnectionHandler, useFragment, useMutation } from 'react-relay';
import { TodoFragment$key } from './__generated__/TodoFragment.graphql';
import { RecordSourceSelectorProxy } from 'relay-runtime/lib/store/RelayStoreTypes';
import { useState } from 'react';
import { CreateNewFragment$key } from './__generated__/CreateNewFragment.graphql';


const CreateNewMutation = graphql`
  mutation CreateNewMutation(
    $completed: Boolean!,
    $task: String!
  ) {
    createTodo(
      input: {todo: {completed: $completed, task:$task}}
    ) {
      todoEdge @appendEdge(connections: ["client:root:__TodosQuery_allTodos_connection"]) {
     
        node {
          taskUid
          completed
          dateCreated
          dateUpdated
          userUid
          task
        }
      }
    }
  }
`;

type Props = {
  createNewProp: CreateNewFragment$key;
  };


function CreateNew() {
  const [taskTxt, setTaskTxt] = useState("")
 

  const [commitMutation, isMutationInFlight] = useMutation(CreateNewMutation);
  function onPost() {
    setTaskTxt(''); 

    const connectionId = ConnectionHandler.getConnectionID(
      'root',
      'TodosQuery_allTodos'
  )

  console.log(connectionId)
    
    commitMutation({
      variables: {
        completed: false,
        task: taskTxt,
      },
      onCompleted:(c)=>{
        console.log(c)
      },
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
