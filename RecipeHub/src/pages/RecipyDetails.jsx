import React, { useContext, useEffect } from 'react'
import { RiCameraAiFill } from "react-icons/ri";
import OutlineButton from '../component/common/OulineButton';
import { FaBookmark, FaFolderPlus, FaShare, FaPrint,FaShoppingBasket,FaEdit   } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GiCampCookingPot,GiFruitBowl  } from "react-icons/gi";
import { FaThumbsUp } from "react-icons/fa6";
import { useParams } from 'react-router-dom';
import { useRecipeContext } from '../context/RecipeContext';
import { AuthContext } from '../context/AuthContext';

function RecipyDetails() {
    const { id } = useParams()
    const { getRecipeById, recipeById } = useRecipeContext()
    const{user}=useContext(AuthContext)

    useEffect(() => {
        getRecipeById(id)
    }, [id])
    return (
        <div className='max-w-6xl mx-auto bg-white shadow-md lg:p-6 p-4 gap-8 grid grid-cols-1 lg:grid-cols-8'>
            <div className='lg:col-span-2 space-y-'>
                <div className='relative '>
                    <img className='rounded-lg w-full ' src={recipeById?.mainPhoto} alt="" />
                    <div className='absolute bottom-0 lg:hidden text-white bg-black/50 w-full p-3'>
                        <h1 className='lg:text-3xl text-xl  font-semibold uppercase'> {recipeById?.title || 'no'}</h1>
                        <div className="flex items-center space-x-2 mb-2 mt-2">
                            <img className='w-10 h-10 rounded-full' src={recipeById?.user?.avatar} alt="" />
                            <div>
                                <p className="text-sm font-semibold capitalize ">{recipeById?.user?.name}</p>
                                <p className="text-xs text-gray-100">{recipeById?.user?.email}</p>
                            </div>
                        </div>


                    </div>



                </div>
                <div className='sticky top-0'>
                    <h3 className='lg:text-xl text-lg font-semibold uppercase mt-4 mb-2 flex gap-3 text-orange-600 items-center'><GiFruitBowl size={28} />Ingredients</h3>
                    <ul className='divide-y divide-gray-300 space-y-2 '>
                        {recipeById?.ingredients?.map(items => (
                            <li className='py-1 text-sm'>{items}</li>

                        ))}

                    </ul>
                </div>
            </div>
            <div className='lg:col-span-6 space-y-4'>
                <h1 className='lg:text-3xl text-2xl font-semibold uppercase text-orange-500'> {recipeById?.title || 'no'}</h1>
                <button className='border border-gray-300 text-sm p-2 flex gap-2 rounded items-center text-gray-500'> <RiCameraAiFill /> Share its first Cooksnap!</button>
                <div className="flex items-center space-x-2 mb-4">
                    <img className='w-10 h-10 rounded-full' src={recipeById?.user?.avatar} alt="" />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{recipeById?.user?.name}</p>
                        <p className="text-xs text-gray-500">{recipeById?.user?.email}</p>
                    </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {user?._id==recipeById?.user?._id?
                    <div className='flex gap-3'>
                        <OutlineButton label="Edit" icon={FaEdit} />
                    <OutlineButton label="Delete" icon={MdDelete} />

                    </div>:
                    <div className='flex gap-3'>
                        <OutlineButton label="Like" icon={FaThumbsUp} />
                    <OutlineButton label="Saved" icon={FaBookmark} active />
                        
                    </div>}
                    
                    <OutlineButton label="Share" icon={FaShare} />
                    <OutlineButton label="Add to folders" icon={FaFolderPlus} />

                    <OutlineButton label="Print" icon={FaPrint} />
                </div>
                <div>
                    <h3 className='lg:text-xl text-lg uppercase font-semibold mb-4 flex gap-3 text-orange-600 items-center'> <GiCampCookingPot size={28} />Cooking Instructions</h3>
                    <ol className='space-y-4'>
                        {
                            recipeById?.steps?.map((items, index) => (

                                <li
                                    id="step_40322648"
                                    className="step mb-rg flex flex-row gap-2"
                                    data-collapse-recipe-target="step"
                                >
                                    {/* Step Number */}
                                    <div className="flex-shrink-0 w-6  mr-sm">
                                        <div
                                            className="flex p-2 flex-col place-content-center place-items-center text-cookpad-14 print:text-cookpad-16 text-gray-100 bg-gray-700 w-6 h-6 mr-2 rounded-full print:font-semibold print:text-cookpad-gray-700 print:bg-transparent"
                                            aria-label="Step 1"
                                        >
                                            {index + 1}
                                        </div>
                                    </div>

                                    {/* Step Content */}
                                    <div className="w-full grid gap-sm">
                                        <div dir="auto ">
                                            <p className="mb-sm overflow-wrap-anywhere">
                                                {items.text}
                                            </p>
                                        </div>

                                        {/* Attachments */}
                                        <div className="-mx-rg px-rg flex gap-4 step-attachments-list gap-sm overflow-auto mt-4 scroll-bar-hidden">
                                            {items.images.map(items => (
                                                <div className="relative print:contents aspect-[5/4] min-w-fit">

                                                    <img
                                                        className="rounded-lg object-cover w-25 h-25"
                                                        alt="A picture of step 1 of Egg Biryani."
                                                        loading="lazy"
                                                        width="160"
                                                        height="128"
                                                        src={items}
                                                    />
                                                </div>
                                            ))}
                                            {/* Image 1 */}





                                        </div>
                                    </div>
                                </li>
                            ))

                        }


                    </ol>


                </div>
            </div>

        </div>
    )
}

export default RecipyDetails
