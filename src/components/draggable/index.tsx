import { useDrag, useDrop } from 'react-dnd';

type TodoItem = {
  text: string;
  checked: boolean;
}

interface DraggableTodoProps {
  todo: TodoItem;
  index: number;
  moveTodo: (fromIndex: number, toIndex: number) => void;
  handleCheck: (index: number) => void;
  removeTodo: (index: number) => void;
}

export const DraggableTodo: React.FC<DraggableTodoProps> = ({ todo, index, moveTodo, handleCheck, removeTodo }) => {
  const [, ref] = useDrag({
    type: 'TODO',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'TODO',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveTodo(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <li ref={(node) => ref(drop(node))} className="flex justify-between items-center py-2">
      <label className="space-x-4 cursor-pointer">
        <input
          type="checkbox"
          checked={todo.checked}
          onChange={() => handleCheck(index)}
        />
        {todo.checked ? (
          <span className="line-through">{todo.text}</span>
        ) : (
          <span>{todo.text}</span>
        )}
      </label>
      <button className="border border-sky-500 p-1 text-xs" onClick={() => removeTodo(index)}>Remove</button>
    </li>
  );
};