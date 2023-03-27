import graphql from 'babel-plugin-relay/macro';

export const DeleteTodoMutation = graphql`
  mutation DeleteTodoMutation($taskUid: UUID!) {
    deleteTodoByTaskUid(input: { taskUid: $taskUid }) {
      todo {
        taskUid
      }
    }
  }
`;