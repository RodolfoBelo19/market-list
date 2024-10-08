import { useDrag, useDrop } from "react-dnd";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";

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
  handleCheck: (id: string) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
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
      className={`flex justify-between items-center p-2 mb-2 shadow-md rounded-xl border-2 border-green-500
        ${todo.checked ? "bg-green-200 text-black" : "bg-green-50 text-black"}
        `}
    >
      <label className="space-x-4 flex items-center cursor-pointer w-full">
        <input
          className="cursor-pointer w-5 h-5 accent-green-500 hover:accent-green-600"
          type="checkbox"
          checked={todo.checked}
          onChange={() => handleCheck(todo?._id || "")}
        />
        {todo.checked ? (
          <span className="line-through">{todo.text}</span>
        ) : (
          <span>{todo.text}</span>
        )}
      </label>
      {/* <button
        className="flex w-28 gap-2 border border-red-500 bg-white shadow-md hover:bg-gray-100 text-red-500 p-1 text-xs"
        onClick={() => removeTodo(todo?._id || "")}
      >
        <img src={trash} alt="trash" className="w-4 h-4" />
        Remove
      </button> */}
      <Menu>
        <MenuButton className="outline-none bg-transparent items-center rounded-md">
          <EllipsisVerticalIcon className="size-4 fill-black" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-32 origin-top-right rounded-xl gap-1 flex flex-col p-1 text-sm/6 text-white transition duration-100 ease-out"
        >
          <MenuItem>
            <button
              onClick={() => window.alert("Função ainda não implementada!")}
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 bg-green-500 "
            >
              <PencilIcon className="size-4 fill-white/30" />
              Edit
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => removeTodo(todo?._id || "")}
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 bg-green-500 "
            >
              <TrashIcon className="size-4 fill-white/30" />
              Delete
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </li>
  );
};
