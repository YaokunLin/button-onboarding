import './App.css';
import graphql from 'babel-plugin-relay/macro';
import { useFragment, useMutation } from 'react-relay';
import { TodoFragment$key } from './__generated__/TodoFragment.graphql';
import { RecordSourceSelectorProxy } from 'relay-runtime/lib/store/RelayStoreTypes';

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

  ) @raw_response_type {
    updateTodoByTaskUid(
      input: {todoPatch: {completed: $completed}, taskUid: $taskUid}
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
  const todo = useFragment(
    TodoFragment,
    todoProp,
  );
  const [commitMutation, isMutationInFlight] = useMutation(TodoMutation);
  const handleOnChange = () => commitMutation({
    variables: {
      taskUid: todo.taskUid,
      completed: !todo.completed,
    },
    updater: (store: RecordSourceSelectorProxy) => {
      const payload = store.getRootField('updateTodoByTaskUid');
      if (payload && todo) {
        const updatedTodo = payload.getLinkedRecord('todo');
        console.log(updatedTodo)
        if (updatedTodo && todo.__id) {
          const cachedTodo = store.get(todo.__id);
          console.log(cachedTodo)
          if (cachedTodo) {
            cachedTodo.copyFieldsFrom(updatedTodo);
          }
        }
      }
    },
  })


  return (
    <tr style={{background:todo.completed? "green": "red"}}>
      <th>
        <input 
              type="checkbox" 
              name={todo.task} 
              checked={todo.completed ? true : false} 
              onChange={handleOnChange}
              disabled={isMutationInFlight}
        />
      </th>
      <th><label htmlFor={todo.task}> {todo.task}</label></th>
      
      
      
    </tr>
  );
}

export default Todo;
