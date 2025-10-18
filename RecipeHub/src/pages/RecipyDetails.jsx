import React, { useContext, useEffect, useState } from 'react'
import { RiCameraAiFill } from "react-icons/ri";
import OutlineButton from '../component/common/OulineButton';
import { FaBookmark, FaFolderPlus, FaShare, FaPrint, FaShoppingBasket, FaEdit, FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GiCampCookingPot, GiFruitBowl } from "react-icons/gi";
import { FaThumbsUp } from "react-icons/fa6";
import { Link, useParams } from 'react-router-dom';
import { useRecipeContext } from '../context/RecipeContext';
import { AuthContext } from '../context/AuthContext';
import Modal from '../component/common/Modal';
import { useCookSnap } from '../context/CooksnapContext';
import { Button } from '../component/common/Button';

function RecipyDetails() {
    const { id } = useParams()
    const { getRecipeById, recipeById, deleteRecipe, toggleLike } = useRecipeContext()

    const { createCookSnap, loading, fetchCookSnaps, cookSnaps } = useCookSnap();
    const [isModalOpen, setModalOpen] = useState(false);
    const { user } = useContext(AuthContext)
    console.log('recipeById', recipeById);
    console.log('cookSnaps', cookSnaps);


    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [recipeId, setRecipeId] = useState(id);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file); // Just set the file directly
        } else {
            setImage(null);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('caption', caption);
            formData.append('recipeId', recipeId);
            formData.append('image', image); // <-- will be a File object

            await createCookSnap(formData);

            // Reset form
            fetchCookSnaps(id)
            setCaption('');
            setImage(null);
            setRecipeId(id);
            setModalOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };





    useEffect(() => {
        getRecipeById(id)
        fetchCookSnaps(id)
    }, [id])


    return (
        <div className='max-w-6xl mx-auto bg-white shadow-md lg:p-6 p-4 gap-8 grid grid-cols-1 lg:grid-cols-8'>
            <div className='lg:col-span-2 space-y-'>
                <div className='relative '>
                    <img className='rounded-lg w-full ' src={recipeById?.mainPhoto} alt="" />
                    <div className='absolute bottom-0 lg:hidden text-white bg-black/50 w-full p-3'>
                        <h1 className='lg:text-3xl text-xl   font-semibold uppercase cursive'> {recipeById?.title || ''} <span className='flex items-center gap-2'>( <FaHeart color='red' /> {recipeById?.likes?.length} )</span></h1>
                        <p>{recipeById?.description}</p>
                        <div className="flex items-center space-x-2 mb-2 mt-2">
                            <img className='w-10 h-10 rounded-full' src={recipeById?.user?.avatar || '/public/cheflogo.png'} alt="" />
                            <div>
                                <p className="text-sm font-semibold capitalize ">{recipeById?.user?.name}</p>
                                <p className="text-xs text-gray-100">{recipeById?.user?.email}</p>
                            </div>
                        </div>


                    </div>



                </div>
                <div className='sticky top-0'>
                    <h3 className='lg:text-xl text-lg font-semibold uppercase mt-4 mb-2 flex gap-3 text-white p-2 cursive bg-orange-500 items-center cursive'><GiFruitBowl size={28} />Ingredients</h3>
                    <ul className='divide-y divide-gray-300 space-y-2 '>
                        {recipeById?.ingredients?.map(items => (
                            <li className='py-1 text-sm'>{items}</li>

                        ))}

                    </ul>
                </div>
            </div>
            <div className='lg:col-span-6 space-y-4'>
                <h1 className='lg:text-3xl text-2xl hidden font-semibold uppercase bg-orange-500 w-fit shadow-md p-2 text-white lg:flex gap-2 cursive'> {recipeById?.title || 'no'}<span className='flex items-center gap-2 text-lg text-white'>( <FaHeart color='white' /> {recipeById?.likes?.length} )</span></h1>
                <p className='text-gray-600 text-sm'>{recipeById?.description}</p>

                <button onClick={() => setModalOpen(true)} className='border border-gray-300 text-sm p-2 flex gap-2 rounded items-center text-gray-500'> <RiCameraAiFill /> Share its first Cooksnap!</button>


                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold text-orange-500 font-serif cursive">Add your cook snap!</h2>
                            <p className="text-gray-600 cursive">Share your delicious creation with a caption.</p>
                        </div>


                        {image && (
                            <div className="w-full h-48 overflow-hidden rounded-lg border">
                                <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* File Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                            <input
                                required
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0 file:text-sm file:font-semibold
          file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                            />
                        </div>

                        {/* Caption Textarea */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                            <textarea
                                required
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                rows={3}
                                placeholder="Write your caption here..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none  resize-none"
                            ></textarea>
                        </div>


                        <Button type="submit" loading={loading} children={'Post Snap'} />
                    </form>      </Modal>
                <Link to={`/profile/${recipeById?.user?._id}`} className="flex items-center space-x-2 mb-4">
                    <img className='w-10 h-10 rounded-full' src={recipeById?.user?.avatar || '/public/cheflogo.png'} alt="" />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{recipeById?.user?.name}</p>
                        <p className="text-xs text-gray-500">{recipeById?.user?.email}</p>
                    </div>
                </Link>
                <div className="flex gap-3 flex-wrap">
                    {user?._id == recipeById?.user?._id ?
                        <div className='flex gap-3'>
                            <Link to={`/edit/${recipeById?._id}`}>
                                <OutlineButton label="Edit" icon={FaEdit} />
                            </Link>
                            <OutlineButton onClick={() => deleteRecipe(recipeById?._id)} label="Delete" icon={MdDelete} />

                        </div> :
                        <div className='flex gap-3'>
                            <OutlineButton
                                active={recipeById?.likes?.includes(user?._id)}
                                onClick={() => toggleLike(recipeById?._id)}
                                label={recipeById?.likes?.includes(user?._id) ? 'Liked' : 'Like'}
                                icon={FaThumbsUp}
                            />
                            <OutlineButton label="Saved" icon={FaBookmark} active />

                        </div>}

                    <OutlineButton label="Share" icon={FaShare} />
                    <OutlineButton label="Add to folders" icon={FaFolderPlus} />

                    <OutlineButton label="Print" icon={FaPrint} />
                </div>
                <div>
                    <h3 className='lg:text-xl text-lg uppercase font-semibold mb-4 flex gap-3 text-white p-2 cursive bg-orange-500 items-center cursive'> <GiCampCookingPot size={28} />Cooking Instructions</h3>
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
                <div>
                    <h3 className='flex text-2xl gap-2 mb-4 items-center text-white p-2 cursive bg-orange-500'>
                        <RiCameraAiFill /> CookSnaps
                    </h3>

                    <div className='overflow-x-auto  p-2 rounded'>
                        <div className='flex gap-4 flex-nowrap'>
                            {cookSnaps.map(items => (
                                <div key={items._id} className='bg-white p-2 shadow-lg rounded min-w-[200px]'>
                                    <img className='w-full h-40 object-cover rounded' src={items?.image} alt="CookSnap" />

                                    <Link to={`/profile/${items?.user?._id}`} className='flex gap-2 items-center bg-white p-2'>
                                        <img
                                            className='w-10 h-10 rounded-full'
                                            src={items?.user?.avatar || '/public/cheflogo.png'}
                                            alt="User Avatar"
                                        />
                                        <h3 className='capitalize text-sm'>{items?.user?.name}</h3>
                                    </Link>

                                    <p className='capitalize text-sm'>{items?.caption}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default RecipyDetails
