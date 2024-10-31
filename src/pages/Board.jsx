import Checkbox from "@mui/material/Checkbox"; // Import Checkbox component
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast, { Toaster } from "react-hot-toast";
import { useParams, useSearchParams } from "react-router-dom";
import { initialProjects } from "../utils/constant";
import { FixedSizeList as List } from "react-window";
import ScrollContainer from "react-indiana-drag-scroll"; // Adjust the import according to your setup

const Board = () => {
  const [searchParams] = useSearchParams();
  const [currentTheme, setCurrentTheme] = useState("light");
  const { id } = useParams();
  const projectId = parseInt(id, 10);
  const project = initialProjects.find((proj) => proj.id === projectId);
  const [collapsedStores, setCollapsedStores] = useState({});

  useEffect(() => {
    const theme = searchParams.get("theme");
    setCurrentTheme(theme);
  }, [searchParams]);

  if (!project) {
    return <div>Project not found!</div>;
  }

  const [stores, setStores] = useState(() => {
    const storedData = localStorage.getItem(`project-${projectId}`);
    return storedData ? JSON.parse(storedData) : project.data;
  });

  useEffect(() => {
    const saveToLocalStorage = (data) => {
      try {
        const currentSize = new Blob(Object.values(localStorage)).size;
        const newSize = new Blob([JSON.stringify(data)]).size;
        if (currentSize + newSize > 5 * 1024 * 1024) {
          localStorage.removeItem(`project-${projectId}`);
        }

        localStorage.setItem(`project-${projectId}`, JSON.stringify(data));
      } catch (error) {
        console.error("Error saving to local storage", error);
      }
    };
    saveToLocalStorage(stores);
  }, [stores, projectId]);

  // Handle the Logic of Drag and Drop
  const handleDragAndDrop = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const newStores = stores.filter(
        (store) => store.id !== "d9c3f4e8-ec62-4631-a0a0-3742c1e83967"
      );

      const [removedStore] = newStores.splice(source.index, 1);

      const fixedStoreIndex = stores.findIndex(
        (store) => store.id === "d9c3f4e8-ec62-4631-a0a0-3742c1e83967"
      );

      if (destination.index >= fixedStoreIndex) {
        toast.error("Closed issue list position cannot be changed.", {
          duration: 2000,
        });
        return;
      }

      newStores.splice(destination.index, 0, removedStore);
      newStores.splice(fixedStoreIndex, 0, stores[fixedStoreIndex]);

      setStores(newStores);
      return;
    }

    const itemSourceIndex = source.index;
    const itemDestinationIndex = destination.index;

    const storeSourceIndex = stores.findIndex(
      (store) => store.id === source.droppableId
    );
    const storeDestinationIndex = stores.findIndex(
      (store) => store.id === destination.droppableId
    );

    const newSourceItems = [...stores[storeSourceIndex].items];
    const newDestinationItems =
      source.droppableId !== destination.droppableId
        ? [...stores[storeDestinationIndex].items]
        : newSourceItems;

    const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);
    newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

    const newStores = [...stores];

    newStores[storeSourceIndex] = {
      ...stores[storeSourceIndex],
      items: newSourceItems,
    };
    newStores[storeDestinationIndex] = {
      ...stores[storeDestinationIndex],
      items: newDestinationItems,
    };

    setStores(newStores);
  };

  const handleToggleCollapse = (storeId) => {
    setCollapsedStores((prev) => ({
      ...prev,
      [storeId]: !prev[storeId],
    }));
  };

  const isCollapsed = (storeId) => collapsedStores[storeId] || false;

  return (
    <div
      className={`p-3 flex overflow-scroll scrollable-no-scrollbar  ${
        currentTheme === "dark" ? "bg-[#0C192A] text-white" : "bg-white"
      }`}
    >
      <DragDropContext onDragEnd={handleDragAndDrop}>
        <Droppable droppableId="ROOT" type="group" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-4"
            >
              {stores.map((store, index) => {
                const storeClassName = `rounded-[8px] flex flex-col  ${
                  isCollapsed(store.id)
                    ? "bg-none"
                    : ` border border-t-0  w-[350px]  ${
                        currentTheme === "dark"
                          ? "border-gray-700 bg-[#131928]"
                          : "border-gray-200 bg-[#F1F2F4]"
                      }`
                }`;
                
                return (
                  <Draggable
                    draggableId={store.id}
                    index={index}
                    key={store.id}
                    isDragDisabled={
                      store.id === "d9c3f4e8-ec62-4631-a0a0-3742c1e83967"
                    }
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className={storeClassName}
                      >
                        <StoreList
                          {...store}
                          stores={stores}
                          setStores={setStores}
                          isCollapsed={isCollapsed(store.id)}
                          onToggleCollapse={() =>
                            handleToggleCollapse(store.id)
                          }
                          currentTheme={currentTheme}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Toaster />
    </div>
  );
};

function StoreList({
  name,
  items,
  id,
  color,
  border,
  stores,
  setStores,
  isCollapsed,
  onToggleCollapse,
  currentTheme,
}) {
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentName, setCurrentName] = useState(name);

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

  // The content to show when collapse is true
  const renderCollapsedContent = () => (
    <div
      className={`flex-col justify-center items-center border  rounded-t-[4px]  w-[40px] ${
        currentTheme === "dark" ? "bg-black" : "border-[#e5e7eb] bg-white"
      }`}
    >
      <div className={`border-2 rounded-full ${border} mx-2  `}></div>
      <div className="p-2  ">
        <div className="my-2 flex items-center">
          {id !== "d9c3f4e8-ec62-4631-a0a0-3742c1e83967" && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="object-cover cursor-pointer text-primary_bg w-[25px] inline-block focus:outline-none"
            >
              <title>Drag to move card</title>
              <circle cx="6.5" cy="4" r="1.5" fill="#B4B6B8"></circle>
              <circle cx="6.5" cy="9" r="1.5" fill="#B4B6B8"></circle>
              <circle cx="6.5" cy="14" r="1.5" fill="#B4B6B8"></circle>
              <circle cx="11.5" cy="4" r="1.5" fill="#B4B6B8"></circle>
              <circle cx="11.5" cy="9" r="1.5" fill="#B4B6B8"></circle>
              <circle cx="11.5" cy="14" r="1.5" fill="#B4B6B8"></circle>
            </svg>
          )}
        </div>

        <div
          className={`font-semibold capitalize text-[16px]  ${color} whitespace-nowrap truncate  flex justify-center items-center`}
          style={{ writingMode: "vertical-rl" }}
        >
          {currentName}
        </div>
        <div
          className={`text-[12px] flex justify-center items-center  border-2  bg-[#F3F4F6] ${color}  rounded-full  py-2.5 mt-2  ${
            currentTheme === "dark"
              ? "border-gray-500 bg-gray-950"
              : "border-[#E5E7E] bg-[#F3F4F6]"
          }`}
          style={{ writingMode: "vertical-rl" }}
        >
          {items.length}
        </div>
      </div>

      <div className="flex justify-center items-center mb-1 ">
        <svg
          onClick={onToggleCollapse}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="object-cover cursor-pointer w-[25px] inline-block focus:outline-none"
        >
          <title>Expand</title>
          <g id="Component 3">
            <path
              id="Vector 2"
              d="M20.5303 12.5303C20.8232 12.2374 20.8232 11.7626 20.5303 11.4697L15.7574 6.6967C15.4645 6.40381 14.9896 6.40381 14.6967 6.6967C14.4038 6.98959 14.4038 7.46447 14.6967 7.75736L18.9393 12L14.6967 16.2426C14.4038 16.5355 14.4038 17.0104 14.6967 17.3033C14.9896 17.5962 15.4645 17.5962 15.7574 17.3033L20.5303 12.5303ZM3.46967 11.4697C3.17678 11.7626 3.17678 12.2374 3.46967 12.5303L8.24264 17.3033C8.53553 17.5962 9.01041 17.5962 9.3033 17.3033C9.59619 17.0104 9.59619 16.5355 9.3033 16.2426L5.06066 12L9.3033 7.75736C9.59619 7.46447 9.59619 6.98959 9.3033 6.6967C9.01041 6.40381 8.53553 6.40381 8.24264 6.6967L3.46967 11.4697ZM20 11.25L4 11.25L4 12.75L20 12.75L20 11.25Z"
              fill="#667085"
            ></path>
          </g>
        </svg>
      </div>
    </div>
  );

  const handleCloseForm = () => {
    setNewTask("");
    setSelectedColumnIndex(null);
  };

  const handleAddButtonClick = (columnIndex) => {
    if (selectedColumnIndex === columnIndex) {
      setSelectedColumnIndex(null);
    } else {
      setSelectedColumnIndex(columnIndex);
    }
  };

  const handleNewTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleAddTask = (columnIndex) => {
    if (newTask.trim() === "") return;

    const newItems = [
      ...items,
      { id: `${new Date().getTime()}`, name: newTask },
    ];
    const newStores = stores.map((store) => {
      if (store.id === id) {
        return { ...store, items: newItems };
      }
      return store;
    });

    setStores(newStores);

    setNewTask("");
    setSelectedColumnIndex(null);
  };

  return (
    <div>
      {isCollapsed ? (
        renderCollapsedContent()
      ) : (
        <div>
          <div
            className={`flex justify-between items-center border  sticky rounded-t-[4px] z-50  h-[49px] w-full  ${
              currentTheme === "dark"
                ? "bg-[#2d3855] text-white border-gray-500"
                : "bg-white border-[#e5e7eb]"
            }`}
          >
            <div className="flex gap-2 ">
              <div className={`border-2 rounded-full ${border} my-1`}></div>
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
                          currentTheme === "dark" ? "text-black" : ""
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
                  className={`flex justi items-center font-semibold capitalize text-[16px] my-1 ${color} whitespace-nowrap ${
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
              <div
                className={`text-[12px] flex justify-center items-center my-2  border-2   ${color}  rounded-full px-2 cursor-default  ${
                  currentTheme === "dark"
                    ? "bg-gray-800  border-gray-700"
                    : "bg-[#F3F4F6] border-[#E5E7E]"
                }`}
              >
                {items.length}
              </div>
            </div>
            <div className="flex justify-center items-center gap-3">
              <svg
                onClick={onToggleCollapse}
                width="20"
                height="9"
                viewBox="0 0 20 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="object-cover cursor-pointer text-primary_bg w-[25px] inline-block focus:outline-none stroke-[#a7a7a7]"
              >
                <g id="Vector">
                  <path
                    d="M5.50324 0.987192C5.27423 0.758176 4.90292 0.758176 4.6739 0.987192C4.44488 1.21621 4.44488 1.58752 4.6739 1.81653L6.91118 4.05381L0.586434 4.05381C0.262556 4.05381 2.657e-07 4.31637 0 4.64024C0 4.96412 0.262555 5.22668 0.586432 5.22668L6.91118 5.22667L4.6739 7.46395C4.44488 7.69297 4.44488 8.06428 4.6739 8.29329C4.90292 8.52231 5.27422 8.52231 5.50324 8.29329L8.74162 5.05491C8.97064 4.8259 8.97064 4.45459 8.74162 4.22557L5.50324 0.987192Z"
                    fill="#111111"
                  ></path>
                  <path
                    d="M14.4968 8.29407C14.7258 8.52309 15.0971 8.52309 15.3261 8.29407C15.5551 8.06506 15.5551 7.69375 15.3261 7.46473L13.0888 5.22746L19.4136 5.22746C19.7374 5.22746 20 4.9649 20 4.64102C20 4.31715 19.7374 4.05459 19.4136 4.05459L13.0888 4.05459L15.3261 1.81731C15.5551 1.5883 15.5551 1.21699 15.3261 0.987973C15.0971 0.758956 14.7258 0.758958 14.4968 0.987974L11.2584 4.22635C11.0294 4.45537 11.0294 4.82668 11.2584 5.05569L14.4968 8.29407Z"
                    fill="#111111"
                  ></path>
                </g>
              </svg>{" "}
              <button
                className="text-[22px] font-bold text-[#A7A7A7] pr-3"
                onClick={() => handleAddButtonClick(items.length)}
              >
                +
              </button>
            </div>
          </div>
          <Droppable
            droppableId={id}
            mode="virtual"
            renderClone={(provided, snapshot, rubric) => {
              const item = items[rubric.source.index];
              return (
                <div
                  className={`mx-3 my-2 border shadow-md p-4 break-all rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    currentTheme === "dark"
                      ? "bg-[#324370] border-gray-700 text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  {...provided.dragHandleProps}
                  {...provided.draggableProps}
                  ref={provided.innerRef}
                >
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Checkbox
                        sx={{
                          padding: 0,
                          "& .MuiSvgIcon-root": {
                            fontSize: 18,
                          },
                        }}
                        defaultChecked
                      />
                      <div
                        className={`text-xs font-medium ${
                          currentTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-600"
                        } ${
                          id === "d9c3f4e8-ec62-4631-a0a0-3742c1e83967"
                            ? "line-through"
                            : ""
                        }`}
                      >
                        DEMO-1
                      </div>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#F1AF3C] hover:opacity-80 transition-opacity duration-200"
                    >
                      <path
                        d="M18 9L6 9M18 15L6 15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              );
            }}
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col h-[520px] px-2"
              >
                {selectedColumnIndex === items.length && (
                  <div
                    className={`mb-3 border shadow-md p-4 rounded-lg mx-2 transition-all duration-200 ${
                      currentTheme === "dark"
                        ? "bg-[#324370] border-gray-600"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    {/* New Task Input */}
                    <div
                      className={`text-sm font-bold mb-2 ${
                        currentTheme === "dark" ? "text-white" : ""
                      }`}
                    >
                      Title
                    </div>
                    <input
                      type="text"
                      value={newTask}
                      onChange={handleNewTaskChange}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && newTask.trim() !== "") {
                          handleAddTask(items.length);
                        }
                      }}
                      className={`border w-full p-2 rounded-md outline-none text-sm transition-colors duration-200 focus:border-blue-400 ${
                        currentTheme === "dark"
                          ? "bg-[#1f2937] text-white border-gray-600"
                          : "bg-white"
                      }`}
                      placeholder="Enter new task"
                      autoFocus
                    />
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => handleAddTask(items.length)}
                        className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ${
                          newTask.trim() === ""
                            ? "bg-gray-100 cursor-not-allowed text-gray-400"
                            : "bg-[#133280] text-white hover:bg-[#1a4099] active:transform active:scale-95"
                        }`}
                        disabled={newTask.trim() === ""}
                      >
                        Create issue
                      </button>
                      <button
                        onClick={handleCloseForm}
                        className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 active:transform active:scale-95 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className={`flex-1 rounded-lg  ${
                    currentTheme === "dark"
                      ? "border-gray-500"
                      : "border-[#e5e7eb]"
                  }`}
                >
                  <List
                    className="overflow-y-scroll"
                    height={520}
                    itemCount={items.length}
                    itemSize={95} // Increased to accommodate margins
                    width={330}
                  >
                    {({ index, style }) => {
                      const item = items[index];
                      return (
                        <Draggable
                          draggableId={item.id}
                          index={index}
                          key={item.id}
                        >
                          {(provided, snapshot) => (
                            <div
                              className={`my-2 border shadow-md p-4 break-all rounded-lg cursor-pointer transition-all duration-200 ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              } ${
                                currentTheme === "dark"
                                  ? "bg-[#324370] border-gray-700 text-white"
                                  : "bg-white hover:bg-gray-50"
                              }`}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              style={{
                                ...style,
                                ...provided.draggableProps.style,
                                height: "auto", // Allow content to determine height
                              }}
                            >
                              <div className="text-sm font-medium mb-3">
                                {item.name}
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                  <Checkbox
                                    sx={{
                                      padding: 0,
                                      "& .MuiSvgIcon-root": {
                                        fontSize: 18,
                                      },
                                    }}
                                    defaultChecked
                                  />
                                  <div
                                    className={`text-xs font-medium ${
                                      currentTheme === "dark"
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                    } ${
                                      id ===
                                      "d9c3f4e8-ec62-4631-a0a0-3742c1e83967"
                                        ? "line-through"
                                        : ""
                                    }`}
                                  >
                                    DEMO-1
                                  </div>
                                </div>
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="text-[#F1AF3C] hover:opacity-80 transition-opacity duration-200"
                                >
                                  <path
                                    d="M18 9L6 9M18 15L6 15"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    }}
                  </List>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </div>
  );
}

export default Board;
