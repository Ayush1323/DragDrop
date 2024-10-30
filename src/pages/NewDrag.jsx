import Checkbox from "@mui/material/Checkbox"; // Import Checkbox component
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast, { Toaster } from "react-hot-toast";
import { useParams, useSearchParams } from "react-router-dom";
import { initialProjects } from "../utils/constant";
import { FixedSizeList as List } from "react-window";
import ScrollContainer from "react-indiana-drag-scroll"; // Adjust the import according to your setup
import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";

const NewDrag = () => {
  const DATA = [
    {
      id: "0e2f0db1-5457-46b0-949e-8032d2f9997a",
      name: "In progress",
      items: Array.from({ length: 20 }, (v, i) => ({
        id: crypto.randomUUID(),
        name: `TASK ${i + 1}`,
      })),
      tint: 1,
      color: "text-[#2b83de]",
      border: "border-[#2b83de]",
    },
    {
      id: "487f68b4-1746-438c-920e-d67b7df46247",
      name: "To Do",
      items: Array.from({ length: 20 }, (v, i) => ({
        id: crypto.randomUUID(),
        name: `TASK ${i + 1}`,
      })),
      tint: 2,
      color: "text-[#f7a23a]",
      border: "border-[#f7a23a]",
    },
    {
      id: "25daffdc-aae0-4d73-bd31-43f73101e7c0",
      name: "In Review",
      items: Array.from({ length: 20 }, (v, i) => ({
        id: crypto.randomUUID(),
        name: `TASK ${i + 1}`,
      })),
      tint: 3,
      color: "text-[#e23333]",
      border: "border-[#e23333]",
    },
    {
      id: "b2ad2d6f-b8cb-4ed9-85af-2b6c1b7f9a60",
      name: "Ready For QA",
      items: Array.from({ length: 20 }, (v, i) => ({
        id: crypto.randomUUID(),
        name: `TASK ${i + 1}`,
      })),
      tint: 4,
      color: "text-[#7ec451]",
      border: "border-[#7ec451]",
    },
    {
      id: "d9c3f4e8-ec62-4631-a0a0-3742c1e83967",
      name: "Closed",
      items: [
        { id: "e0d987d7-0c6e-4aa8-973b-086f10d659a0", name: "TASK 9" },
        { id: "fd0bc1d1-1e4b-4909-8348-b9bcf83b8c84", name: "TASK 10" },
      ],
      tint: 5,
      color: "text-[#696969]",
      border: "border-[#696969]",
    },
  ];
  const { theme } = useContext(ThemeContext);
  const [stores, setStores] = useState(DATA);

  const handleDragAndDrop = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (type === "group") {
      const newStores = [...stores];
      const [movedStore] = newStores.splice(source.index, 1);
      newStores.splice(destination.index, 0, movedStore);
      setStores(newStores);
      return;
    }

    const sourceStoreIndex = stores.findIndex(
      (store) => store.id === source.droppableId
    );
    const destStoreIndex = stores.findIndex(
      (store) => store.id === destination.droppableId
    );

    const sourceItems = [...stores[sourceStoreIndex].items];
    const destItems =
      source.droppableId === destination.droppableId
        ? sourceItems
        : [...stores[destStoreIndex].items];

    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);

    const newStores = [...stores];
    newStores[sourceStoreIndex] = {
      ...stores[sourceStoreIndex],
      items: sourceItems,
    };
    newStores[destStoreIndex] = {
      ...stores[destStoreIndex],
      items: destItems,
    };

    setStores(newStores);
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragAndDrop}>
        <Droppable droppableId="ROOT" type="group" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-3 p-3   scrollable-no-scrollbar "
            >
              {stores.map((store, index) => (
                <Draggable draggableId={store.id} index={index} key={store.id}>
                  {(provided) => (
                    <div
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className="w-[350px] bg-gray-100 p-4 rounded shadow-md"
                    >
                      <StoreList {...store} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

function StoreList({ name, items, id }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentName, setCurrentName] = useState(name);
  const { theme } = useContext(ThemeContext);

  // Inside StoreList component:
  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setCurrentName(e.target.value);
  };

  const handleSaveName = () => {
    // Update the store name in the global stores state
    const updatedStores = stores.map((store) =>
      store.id === id ? { ...store, name: currentName } : store
    );
    setStores(updatedStores);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Revert to the original name and exit edit mode
    setCurrentName(name);
    setIsEditing(false);
  };

  const Row = ({ index, style }) => {
    const item = items[index];
    return (<Draggable draggableId={item.id} index={index} key={item.id}>
        {(provided) => (
          <div
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="bg-white p-2 mb-2 rounded shadow flex items-center justify-between w-[350px]"
          >
            <span>{item.name}</span>
            <Checkbox
              sx={{
                padding: 0,
                "& .MuiSvgIcon-root": {
                  fontSize: 18,
                },
              }}
              defaultChecked
            />
          </div>
        )}
      </Draggable>)}


  return (
    <Droppable
    droppableId={id}
    mode="virtual"
    renderClone={(provided, snapshot, rubric) => {
      const item = items[rubric.source.index];
      return (
        <div
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="bg-white p-2 mb-2 rounded shadow flex items-center justify-between w-[350px]"
          >
            <span>{item.name}</span>
            <Checkbox
              sx={{
                padding: 0,
                "& .MuiSvgIcon-root": {
                  fontSize: 18,
                },
              }}
              defaultChecked
            />
          </div>
      );
    }}
  >
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="h-[520px] overflow-auto scrollable-no-scrollbar  "
        >
          {isEditing ? (
            <div className="relative ">
              <input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                autoFocus
                className={`p-1 mt-[1px]  text-black outline-none border border-[#D1D5DB]  rounded-lg text-[16px]`}
              />

              <div className="flex justify-center items-center gap-3 absolute right-0 -bottom-8">
                <button onClick={handleSaveName}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    class="h-7 w-7  false bg-[#28448A] text-white rounded-sm shadow-md p-1 "
                  >
                    <path
                      fill-rule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
                <button onClick={handleCancelEdit}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    class={`h-7 w-7 bg-white shadow-lg rounded-sm p-1  ${
                      theme === "dark" ? "text-black" : ""
                    }`}
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <h3
              className={`flex justi items-center font-semibold capitalize text-[16px] my-1  whitespace-nowrap ${
                id === "d9c3f4e8-ec62-4631-a0a0-3742c1e83967"
                  ? ""
                  : "cursor-pointer"
              } truncate  max-w-[200px]`}
              onClick={
                id === "d9c3f4e8-ec62-4631-a0a0-3742c1e83967"
                  ? null
                  : handleNameClick
              }
            >
              {currentName}
            </h3>
          )}
           <List
            height={520} // Adjust the height as needed
            itemCount={items.length}
            itemSize={50} // Adjust the height of each item as needed
            width={"100%"}
            className="mt-2 overflow-auto"
          >
            {Row}
          </List>
            {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default NewDrag;
