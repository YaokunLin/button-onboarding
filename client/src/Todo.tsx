import './App.css';
import graphql from 'babel-plugin-relay/macro';
import { useFragment, useMutation } from 'react-relay';
import { TodoFragment$key } from './__generated__/TodoFragment.graphql';

const TodoFragment = graphql`
  fragment TodoFragment on Todo {
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

  ) {
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
  function handleCheckboxClicked() {
    console.log("checked", {
      taskUid: todo.taskUid,
      completed: !todo.completed,
    })
    commitMutation({
      variables: {
        taskUid: todo.taskUid,
        completed: !todo.completed,
      },
    })
  }

  console.log(todo)

  return (
    <tr style={{background:todo.completed? "green": "red"}}>
      <th>
        <input 
              type="checkbox" 
              id="vehicle1" 
              name={todo.task} 
              checked={todo.completed ? true : false} 
              onChange={handleCheckboxClicked}
              disabled={isMutationInFlight}
        />
      </th>
      <th><label htmlFor={todo.task}> {todo.task}</label></th>
      
      
      
    </tr>
  );
}

export default Todo;
