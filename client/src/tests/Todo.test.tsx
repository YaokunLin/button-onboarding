import React, { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import {createMockEnvironment, MockPayloadGenerator} from 'relay-test-utils';
import ReactTestRenderer from 'react-test-renderer'; 
import { RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import type {TodosTestQuery as TodosTestQueryType} from './__generated__/TodosTestQuery.graphql';
import Todo from '../Todo';


test('renders Loading', async () => {
    const environment = createMockEnvironment();
  
    render(
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback={"Loading..."}>
          <App />
        </Suspense>
      </RelayEnvironmentProvider>,
    );
  
    const textElement = await screen.findByText("Loading...");
    expect(textElement).toBeInTheDocument();
  });

  test('Fragment', () => {
    const environment = createMockEnvironment();
    const TestRenderer = () => {  
        const TodosTestQuery = graphql`
        query TodosTestQuery($count: Int)  
        {
          allTodos(first: $count) @connection(key: "TodosQuery_allTodos") {
            __id
            edges {
              node {
                ...TodoFragment
                taskUid
              }
            }
          }
        }
        `;
    const data = useLazyLoadQuery<TodosTestQueryType>(
            TodosTestQuery,
            {count: 100},
          );
    const allTodos = data.allTodos;
    const todos = allTodos?.edges;
    if (todos && todos[0] && todos[0].node){
        return <Todo todoProp={todos[0].node} />
    }
  
    return <>no todos</>
    };
  
    const renderer = ReactTestRenderer.create(
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback="Loading...">
          <TestRenderer />
        </Suspense>
      </RelayEnvironmentProvider>
    );
  
    // Wrapping in ReactTestRenderer.act will ensure that components
    // are fully updated to their final state.
    ReactTestRenderer.act(() => {
      environment.mock.resolveMostRecentOperation(operation =>
        MockPayloadGenerator.generate(operation),
      );
    });
  
    expect(renderer).toMatchSnapshot();
  });