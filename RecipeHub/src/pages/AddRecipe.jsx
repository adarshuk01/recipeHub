
import React, { useState } from "react";
import { FiCamera, FiPlus } from "react-icons/fi";
import { RxDotsHorizontal } from "react-icons/rx";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { useRecipeContext } from "../context/RecipeContext";
import { Button } from "../component/common/Button";

// --- Reusable Components ---

const UserInfo = ({ username, handle }) => (
  <div className="flex items-center space-x-2 mb-4">
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
      W
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-800">{username}</p>
      <p className="text-xs text-gray-500">{handle}</p>
    </div>
  </div>
);

const IngredientInput = ({ value, onChange, onRemove, index }) => (
  <div className="flex items-center space-x-2 mb-2">
    <input
      type="text"
      className="flex-grow p-2 border border-gray-300 focus:outline-none rounded-lg  text-sm"
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      placeholder={index === 0 ? "e.g., 250g flour" : "Ingredient and Quantity"}
    />
    <button
      onClick={onRemove}
      className="text-gray-500 hover:text-red-500 p-2 rounded-full"
    >
      <RxDotsHorizontal size={18} />
    </button>
  </div>
);

const RecipeStep = ({ step, index, onStepChange, onImageUpload, onRemove, onEditImage, onDeleteImage }) => {
  const textareaRef = React.useRef(null);

  // Auto-resize textarea based on content
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset first
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [step.text]);

  return (
    <div className="mb-3 flex space-x-4 bg-gray-50 p-3 rounded-lg">
      <div className="text-lg font-bold text-gray-700 w-6 flex-shrink-0 mt-1">
        {index + 1}
      </div>

      <div className="flex-grow">
        {/* Step Text */}
        <textarea
          ref={textareaRef}
          rows={1}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none  text-sm resize-none overflow-hidden"
          value={step.text}
          onChange={(e) => onStepChange(index, e.target.value)}
          placeholder="Describe the step..."
        />

        {/* Step Images */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="w-16 h-16 bg-gray-100 border border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center text-gray-500 text-xs cursor-pointer hover:bg-gray-200">
            <FiCamera size={20} />
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => onImageUpload(index, e.target.files)}
            />
          </label>

          {step.images?.map((img, imgIndex) => (
            <div key={imgIndex} className="relative group">
              <img
                src={URL.createObjectURL(img)}
                alt={`step-${index}-img-${imgIndex}`}
                className="w-16 h-16 rounded-lg object-cover border"
              />
              <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                {/* Edit */}
                <label className="bg-yellow-500 text-white p-1 rounded-full cursor-pointer">
                  <FaEdit size={12} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onEditImage(index, imgIndex, e.target.files[0])}
                  />
                </label>
                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDeleteImage(index, imgIndex)}
                  className="bg-red-500 text-white p-1 rounded-full"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={onRemove}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Remove Step
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Component ---

const RecipeForm = () => {
  const { createRecipe,loading } = useRecipeContext();

  const [ingredients, setIngredients] = useState([
    { id: Date.now() + 1, name: "250g flour" },
    { id: Date.now() + 2, name: "100ml water" },
  ]);
  const [steps, setSteps] = useState([
    { id: Date.now() + 3, text: "Mix the flour and water until they thicken", images: [] },
  ]);
  const [recipeTitle, setRecipeTitle] = useState(" ");
  const [description,setdescription]=useState('')
  const [cookTime, setCookTime] = useState("1hr 30 mins");
  const [serves, setServes] = useState("2 people");
  const [mainPhoto, setMainPhoto] = useState(null);

  // --- Ingredient Handlers ---
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), name: "" }]);
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index].name = value;
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  // --- Step Handlers ---
  const handleAddStep = () => {
    setSteps([...steps, { id: Date.now(), text: "", images: [] }]);
  };

  const handleStepChange = (index, text) => {
    const newSteps = [...steps];
    newSteps[index].text = text;
    setSteps(newSteps);
  };

  const handleStepImageUpload = (index, files) => {
    const newSteps = [...steps];
    const uploaded = Array.from(files);
    newSteps[index].images = [...newSteps[index].images, ...uploaded];
    setSteps(newSteps);
  };

  const handleEditStepImage = (stepIndex, imgIndex, file) => {
    const newSteps = [...steps];
    newSteps[stepIndex].images[imgIndex] = file;
    setSteps(newSteps);
  };

  const handleDeleteStepImage = (stepIndex, imgIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].images = newSteps[stepIndex].images.filter(
      (_, i) => i !== imgIndex
    );
    setSteps(newSteps);
  };

  const handleRemoveStep = (indexToRemove) => {
    setSteps(steps.filter((_, index) => index !== indexToRemove));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newSteps = Array.from(steps);
    const [moved] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, moved);
    setSteps(newSteps);
  };

  // --- Main Photo Upload ---
  const handleMainPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainPhoto(file);
    }
  };

  // --- Submit ---
const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData();

  formData.append("title", recipeTitle);
  formData.append("cookTime", cookTime);
   formData.append("description", description);
  formData.append("serves", serves);
  if (mainPhoto) formData.append("mainPhoto", mainPhoto);

  // Ingredients
  formData.append(
    "ingredients",
    JSON.stringify(ingredients.map((i) => i.name))
  );

  // Steps text as JSON
  formData.append(
    "steps",
    JSON.stringify(steps.map((step) => ({ text: step.text })))
  );

  // Step images + step index
  steps.forEach((step, idx) => {
    step.images.forEach((img) => {
      formData.append("stepImages", img);         // file
      formData.append("stepImageIndex", idx);     // corresponding step index
    });
  });

  createRecipe(formData);
};



  return (
    <form onSubmit={handleSubmit} className="  relative h-fit  font-sans">
        <div className="flex flex-wrap justify-end p-3 bg-white sticky w-fit mx-auto  -top-5 right-0 z-30  ">
            <div className="flex gap-2 items-center flex-wrap  top-0 shadow-md p-3">
            <Button type="button"  variant="secondary"><FaTrash/> Delete</Button>
          
            <Button loading={loading} type="submit" variant="primary">Save and Publish</Button>


            </div>
        </div>
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column: Photo Upload and Ingredients --- */}
        <div className="lg:col-span-1">
          {/* Photo Upload */}
          <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-500 relative group">
            {mainPhoto ? (
              <img
                src={URL.createObjectURL(mainPhoto)}
                alt="Recipe"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
            ) : (
              <FiCamera size={36} className="mb-2" />
            )}
            <label className="cursor-pointer font-semibold text-amber-600">
              Upload recipe photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMainPhotoUpload}
              />
            </label>
            <p className="text-xs text-center mt-1">
              Show others your finished dish
            </p>

            {mainPhoto && (
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                {/* Edit */}
                <label className="bg-yellow-500 text-white p-1 rounded-full cursor-pointer">
                  <FaEdit size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainPhotoUpload}
                  />
                </label>
                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setMainPhoto(null)}
                  className="bg-red-500 text-white p-1 rounded-full"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}
            
          </div>

           {/* Title and User Info */}
                     <h2 className="text-lg font-semibold text-gray-800 mb-2">Recipe Name</h2>

          <h1 className="text-lg font- text-gray-900 mb-4">
            <input
              type="text"
             
              onChange={(e) => setRecipeTitle(e.target.value)}
              className="w-full focus:outline-none p-1 border border-gray-200"
            />
          </h1>

          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ingredients</h2>

          {/* Serves Input */}
          <div className="flex items-center space-x-4 mb-4 text-sm">
            <label className="text-gray-600 font-medium">Serves</label>
            <input
              type="text"
              value={serves}
              onChange={(e) => setServes(e.target.value)}
              className="p-1 border-b border-gray-300 w-24 text-center focus:border-amber-500"
            />
          </div>

          {/* Ingredient List */}
          <div className="mb-4">
            {ingredients.map((ingredient, index) => (
              <IngredientInput
                key={ingredient.id}
                value={ingredient.name}
                index={index}
                onChange={handleIngredientChange}
                onRemove={() => handleRemoveIngredient(index)}
              />
            ))}
          </div>

          {/* Add Ingredient/Section Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => alert("Section feature not implemented")}
              className="flex items-center space-x-1 text-sm font-semibold text-gray-600 hover:text-gray-800 p-1"
            >
              <FiPlus size={16} />
              <span>Section</span>
            </button>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center space-x-1 text-sm font-semibold text-gray-600 hover:text-amber-600 p-1 transition-colors"
            >
              <FiPlus size={16} />
              <span>Ingredient</span>
            </button>
          </div>
        </div>

        {/* --- Right Column: Recipe Details and Steps --- */}
        <div className="lg:col-span-2">
         
          <UserInfo username="useruk123" handle="@cook_114328223" />

          {/* Description */}
          <div className="mb-8">
            <textarea
              rows={3}
              onChange={(e) => setdescription(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-700  resize-none"
              placeholder="Share more about this dish..."
            />
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-4">Steps</h2>

          {/* Cook Time Input */}
          <div className="mb-6 flex items-center space-x-4">
            <label className="text-gray-600 font-medium text-sm">Cook time</label>
            <input
              type="text"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="p-1 border-b border-gray-300 w-32 text-center text-sm focus:border-amber-500"
            />
          </div>

          {/* Recipe Steps List with Drag and Drop */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="pb-4 "
                >
                  {steps.map((step, index) => (
                    <Draggable key={step.id} draggableId={String(step.id)} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <RecipeStep
                            step={step}
                            index={index}
                            onStepChange={handleStepChange}
                            onImageUpload={handleStepImageUpload}
                            onRemove={() => handleRemoveStep(index)}
                            onEditImage={handleEditStepImage}
                            onDeleteImage={handleDeleteStepImage}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Add Step Button */}
          <div className="mt- flex justify-end">
            <button
              type="button"
              onClick={handleAddStep}
              className="flex items-center space-x-1 text-sm font-semibold text-amber-600 hover:text-amber-800 p-2 transition-colors border border-amber-500 rounded-lg"
            >
              <FiPlus size={16} />
              <span>Step</span>
            </button>
          </div>

         
        </div>
      </div>
    </form>
  );
};

export default RecipeForm;

