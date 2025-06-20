import React, { useState } from "react"
import { Package } from "lucide-react"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil"
import { AllState } from "./state/AllState"

function App() {
    return (
        <RecoilRoot>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<ViewItemsPage />} />
                    <Route path="/add" element={<AddItem />} />
                </Routes>
            </BrowserRouter>
        </RecoilRoot>
    )
}

const NavBar = () => {
    const navigate = useNavigate()

    return (
        <div className="w-full p-6 border-gray-400 border-b-4 bg-white shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
                <div
                    className="text-2xl font-extrabold text-blue-500 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    Inventory Manager
                </div>
                <div className="flex gap-6">
                    <button
                        className="text-sm text-gray-700 hover:underline transition cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        View Items
                    </button>
                    <button
                        className="text-sm text-gray-700 hover:underline transition cursor-pointer"
                        onClick={() => navigate("/add")}
                    >
                        Add Items
                    </button>
                </div>
            </div>
        </div>
    )
}

const AddItem = () => {
    const [itemName, setItemName] = useState("")
    const [desc, setDesc] = useState("")
    const [type, setType] = useState("Shirt")
    const [coverImage, setCoverImage] = useState(null)
    const [additionalImages, setAdditionalImages] = useState([])
    const [allState, setAllState] = useRecoilState(AllState)
    const navigate = useNavigate()

    function allStateHandler() {
        setAllState((prev) => [
            ...prev,
            {
                item: itemName,
                desc: desc,
                type: type,
                cover: URL.createObjectURL(coverImage),
                additional: additionalImages.map((file) =>
                    URL.createObjectURL(file)
                ),
            },
        ])
        navigate("/")
    }

    return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
                <h2 className="text-2xl font-semibold mb-1">Add New Item</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Fill in the details to add a new item to your inventory.
                </p>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Item Name
                    </label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Item Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="Shirt">Shirt</option>
                        <option value="Pant">Pant</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Sports">Sports Gear</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Electronics">Electronics</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Item Description
                    </label>
                    <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full h-24 px-3 py-2 border rounded-md"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Item Cover Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverImage(e.target.files[0])}
                        className="w-full"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Additional Images
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                            setAdditionalImages(Array.from(e.target.files))
                        }
                        className="w-full"
                    />
                </div>
                <button
                    onClick={allStateHandler}
                    className="w-full bg-blue-500 text-white py-2 rounded-md"
                >
                    Add Item
                </button>
            </div>
        </div>
    )
}

const ViewItemsPage = () => {
    const allState = useRecoilValue(AllState)
    const [selectedItem, setSelectedItem] = useState(null)
    const [imageIndex, setImageIndex] = useState(0)

    if (!selectedItem) {
        return (
            <div className="min-h-screen bg-amber-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-6 text-center">
                        Item Gallery
                    </h1>
                    {allState.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                                No items found. Add some items to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {allState.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
                                    onClick={() => {
                                        setSelectedItem(item)
                                        setImageIndex(0)
                                    }}
                                >
                                    <img
                                        src={item.cover}
                                        className="w-full h-60 object-cover rounded-t-xl"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold truncate">
                                            {item.item}
                                        </h3>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            {item.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const images = [selectedItem.cover, ...selectedItem.additional]

    const nextImage = () => setImageIndex((prev) => (prev + 1) % images.length)

    const prevImage = () =>
        setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))

    return (
        <div className="fixed inset-0 bg-amber-50 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
                <button
                    className="absolute top-2 right-2 text-2xl  text-red-400 cursor-pointer"
                    onClick={() => setSelectedItem(null)}
                >
                    ✕
                </button>
                <h2 className="text-xl font-bold mb-2">{selectedItem.item}</h2>
                <p className="text-sm text-gray-600 mb-4">
                    {selectedItem.desc}
                </p>

                <div className="relative mb-4 p-4">
                    <img
                        src={images[imageIndex]}
                        className="w-full h-72 object-contain rounded"
                    />
                    <button
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 px-2 py-1 rounded shadow cursor-pointer"
                        onClick={prevImage}
                    >
                        ←
                    </button>
                    <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 px-2 py-1 rounded shadow cursor-pointer"
                        onClick={nextImage}
                    >
                        →
                    </button>
                </div>

                <div className="flex overflow-x-auto space-x-2 mb-4 scrollbar-thin p-4">
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            className={`h-16 w-24 object-cover rounder cursor-pointer ${
                                idx === imageIndex
                                    ? "border-2 border-blue-500"
                                    : "opacity-60 hover:opacity-100"
                            }`}
                            onClick={() => setImageIndex(idx)}
                        />
                    ))}
                </div>

                <button className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer">
                    Enquire
                </button>
            </div>
        </div>
    )
}

export default App
