import { useDrag, useDrop } from "react-dnd";

type TodoItem = {
  _id?: string;
  text: string;
  checked: boolean;
  order?: number;
};

interface DraggableTodoProps {
  todo: TodoItem;
  index: number;
  order: number;
  moveTodo: (fromIndex: number, toIndex: number) => void;
  handleCheck: (id: string | undefined) => Promise<void>;
  removeTodo: (id: string | undefined) => Promise<void>;
}

export const DraggableTodo: React.FC<DraggableTodoProps> = ({
  todo,
  index,
  moveTodo,
  handleCheck,
  removeTodo,
}) => {
  const [, ref] = useDrag({
    type: "TODO",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "TODO",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveTodo(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <li
      ref={(node) => ref(drop(node))}
      className="flex justify-between items-center py-2"
    >
      <label className="space-x-4 cursor-pointer">
        <input
          type="checkbox"
          checked={todo.checked}
          onChange={() => handleCheck(todo._id)}
        />
        {todo.checked ? (
          <span className="line-through">{todo.text}</span>
        ) : (
          <span>{todo.text}</span>
        )}
      </label>
      <button
        className="border border-sky-500 p-1 text-xs"
        onClick={() => removeTodo(todo._id)}
      >
        Remove
      </button>
    </li>
  );
};
