import React, { useState, ChangeEvent } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableTodo } from "./draggable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MarketListUseCase } from "../../../domain/market-list/use-cases/todo.use-case";
import { MarketListRepositoryApi } from "../../../infra/api-mongo/market-list.repository";
import errorImage from "../../../assets/ErrorPage.gif";
import marketImage from "../../../assets/market.png";
import plusIcon from "../../../assets/plus.svg";

type TodoItem = {
  _id?: string;
  text: string;
  order?: number;
  checked: boolean;
};

const marketListRepository = new MarketListRepositoryApi();
const marketListUseCase = new MarketListUseCase(marketListRepository);

export const MarketList: React.FC = () => {
  const [todo, setTodo] = useState<TodoItem>({ text: "", checked: false });

  const queryClient = useQueryClient();

  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todosData"],
    queryFn: () => marketListUseCase.list(),
    select: (data) => data.sort((a, b) => a.order! - b.order!),
  });

  const addMutation = useMutation({
    mutationFn: async (newTodo: TodoItem) => {
      const order = todos.length;
      await marketListUseCase.add({ ...newTodo, order });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todosData"] as any);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      await marketListUseCase.remove(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todosData"] as any);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedTodo: TodoItem) => {
      if (updatedTodo._id) {
        await marketListUseCase.update(updatedTodo._id, updatedTodo);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todosData"] as any);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (updatedTodos: TodoItem[]) => {
      const ids = updatedTodos
        .map((todo) => todo._id)
        .filter((id) => id !== undefined) as string[];
      const orders = updatedTodos.map((_, index) => index);
      await marketListUseCase.reorder(ids, orders);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todosData"] as any);
    },
  });

  const addTodo = () => {
    setTodo({ text: "", checked: false });
    addMutation.mutate(todo);
  };

  const removeTodo = (id: string) => {
    removeMutation.mutate(id);
  };

  const handleCheck = (id: string) => {
    // @ts-ignore
    const updatedTodo = todos.find((todoItem) => todoItem._id === id);
    if (updatedTodo) {
      // @ts-ignore
      updatedTodo.checked = !updatedTodo.checked;
      updateMutation.mutate(updatedTodo);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodo({ ...todo, text: e.target.value });
  };

  const moveTodo = (fromIndex: number, toIndex: number) => {
    const updatedTodos = [...todos];
    const [removedTodo] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, removedTodo);
    reorderMutation.mutate(updatedTodos);
  };

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-3xl mb-8 font-bold">Something went wrong!</h1>
        <img src={errorImage} alt="error" />
        <h4 className="text-xl mt-2 font-bold">MY BAD 😢</h4>
      </div>
    );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4 flex flex-col mx-auto max-w-md p-5">
        <div className="flex flex-col items-center justify-center">
          <img className="w-32" src={marketImage} alt="market bag" />
          <h1 className="text-3xl text-green-800 font-bold">Market List</h1>
        </div>
        <div className="sm:flex flex-wrap-reverse gap-4 items-center justify-center p-3">
          <div className="flex items-center space-x-4 max-w-sm w-full">
            <input
              className="rounded-xl p-0.5 border-4 shadow-md border-green-500 bg-green-50 text-black w-full"
              type="text"
              value={todo.text}
              onChange={handleInputChange}
            />
            <img
              onClick={addTodo}
              src={plusIcon}
              alt="plus"
              className="w-7 h-7 cursor-pointer"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="shadow rounded-md p-3 max-w-sm w-full mx-auto">
            <div className="animate-pulse space-x-4">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center p-5 rounded-xl border-2 border-zinc-400 bg-zinc-500"></div>
                <div className="flex justify-between items-center p-5 rounded-xl border-2 border-zinc-400 bg-zinc-500"></div>
                <div className="flex justify-between items-center p-5 rounded-xl border-2 border-zinc-400 bg-zinc-500"></div>
                <div className="flex justify-between items-center p-5 rounded-xl border-2 border-zinc-400 bg-zinc-500"></div>
              </div>
            </div>
          </div>
        ) : (
          <ul className="overflow-y-auto max-h-[550px] p-3">
            {todos.map((todoItemFilter, index) => (
              <DraggableTodo
                order={todoItemFilter.order || 0}
                key={`${index}-${todoItemFilter.text}`}
                index={index}
                todo={todoItemFilter}
                moveTodo={moveTodo}
                // @ts-ignore
                handleCheck={handleCheck}
                // @ts-ignore
                removeTodo={removeTodo}
              />
            ))}
          </ul>
        )}
      </div>
    </DndProvider>
  );
};
