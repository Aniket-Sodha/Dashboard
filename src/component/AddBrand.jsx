import { useEffect, useRef, useState } from "react";
import img from "./Images/admin.jpg";
import { app } from "./firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import firebase from "firebase/compat/app";
import { useNavigate, useParams } from "react-router-dom";
import { FaSquarePlus } from "react-icons/fa6";
import axios from "axios";

const AddBrand = () => {
  const [data, setData] = useState({
    itemGroup: "",
    brand: "",
    codeNo: "",
    itemName: "",
    printName: "",
    HSNCode: "",
    textCategory: "",
    storeLocation: "",
    stockUnit: "",
    barcodeSr: "",
    maximumStock: "",
    date: "",
    retail: "",
    mrp: "",
    image: [],
    ingredients: "",
    benefits: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const db = getFirestore(app);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const prod = docSnap.data();
          setData(prod);
          setImages(prod.image || []);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleImageAdd = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("upload_preset", "dashboard");
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/djuvvurva/image/upload",
          formDataUpload
        );

        setImages((prev) => [...prev, res.data.url]);
        setCurrentIndex(images.length);
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Image upload failed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...data, image: images };

      await addDoc(collection(db, "products"), payload);
      toast.success("Product added successfully");

      clearData();
      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  let clearData = () => {
    setData({
      itemGroup: "",
      brand: "",
      codeNo: "",
      itemName: "",
      printName: "",
      HSNCode: "",
      textCategory: "",
      storeLocation: "",
      stockUnit: "",
      barcodeSr: "",
      maximumStock: "",
      date: "",
      retail: "",
      mrp: "",
      image: [],
      ingredients: "",
      benefits: "",
    });
  };
  // code of image viewer
  const [images, setImages] = useState([]); // Store image URLs
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const inputref = useRef();

  // Add image (simulate file picker)

  // Delete current image
  const handleDelete = () => {
    const updatedImages = images.filter((_, i) => i !== currentIndex);
    setImages(updatedImages);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Next image
  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Previous image
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Zoom image
  const handleZoom = () => {
    setZoom((prevZoom) => (prevZoom === 1 ? 1.5 : 1)); // toggle zoom
  };

  // // code end of image viewer
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  // };
  return (
    <>
      <ToastContainer position="bottom-right" />
      <div className="flex justify-center items-center mb-6 mt-4 relative  select-none">
        <h2 className="text-2xl font-bold text-gray-700">
          {id ? "Edit Product" : "Add Product"}
        </h2>
        <FaSquarePlus
          className="text-4xl text-blue-500 cursor-pointer absolute right-5 lg:right-10"
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        />
        {isOpen && (
          <div className=" absolute right-2 top-10 bg-slate-50 border-2 px-3 py-5 rounded-xl">
            <ul className="text-lg font-medium">
              <li className="hover:bg-slate-200">Item Group</li>
              <hr />
              <li className="hover:bg-slate-200">Brand</li>
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-5 flex w-full xl:flex-row flex-col  rounded-2xl shadow-md px-3">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 flex w-full xl:flex-row flex-col ">
            <div className=" xl:w-1/2 w-full border-0 lg:border-r-2">
              {/* Product Name */}
              <div className="flex xl:flex-row flex-col xl:items-center gap-3 mr-2 mb-4">
                <label
                  className=" font-medium text-lg text-nowrap lg:w-36"
                  htmlFor="itemGroup"
                >
                  Item Group
                </label>
                <input
                  type="text"
                  name="itemGroup"
                  value={data.itemGroup}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="itemGroup"
                  placeholder="Enter Item Group"
                  className="w-full p-2  border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="flex xl:flex-row flex-col xl:items-center gap-3 mr-2 mb-4  ">
                <label
                  className=" font-medium text-lg text-nowrap lg:w-98"
                  htmlFor="brand"
                >
                  Brand{" "}
                </label>
                <input
                  type="text"
                  name="brand"
                  value={data.brand}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="brand"
                  placeholder="Enter Item Group"
                  className=" w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label
                  className=" font-medium text-lg text-nowrap "
                  htmlFor="codeNo"
                >
                  Code No{" "}
                </label>
                <input
                  type="text"
                  name="codeNo"
                  value={data.codeNo}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="codeNo"
                  placeholder="Enter Item Group"
                  className=" w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price */}
              <div className="flex xl:flex-row flex-col xl:items-center gap-3 mr-2 mb-4">
                <label
                  className=" font-medium text-lg text-nowrap w-36 "
                  htmlFor="itemName"
                >
                  Item Name
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={data.itemName}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="itemName"
                  placeholder="Enter Item Name"
                  className=" w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* print name */}
              <div className="flex xl:flex-row flex-col xl:items-center gap-3 mr-2 mb-4">
                <label
                  className=" font-medium text-lg text-nowrap w-36 "
                  htmlFor="printName"
                >
                  Print Name
                </label>
                <input
                  type="text"
                  name="printName"
                  value={data.printName}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="printName"
                  placeholder="Enter Print Name"
                  className=" w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="flex xl:flex-row flex-col  xl:items-center gap-3 mr-2 mb-10  ">
                <label
                  className=" font-medium text-lg text-nowrap lg:w-112"
                  htmlFor="HSNCode"
                >
                  HSN Code{" "}
                </label>
                <input
                  type="text"
                  name="HSNCode"
                  value={data.HSNCode}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="HSNCode"
                  placeholder="Enter HSN Code"
                  className=" w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label
                  className=" font-medium text-lg text-nowrap "
                  htmlFor="textCategory"
                >
                  Text Category
                </label>
                <input
                  type="text"
                  name="textCategory"
                  value={data.textCategory}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="textCategory"
                  placeholder="Enter Text Category"
                  className=" w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <hr />
              {/* Stock Option */}
              <div className="flex xl:flex-row flex-col  xl:items-center gap-3 mr-2 mb-4 mt-10">
                <label
                  className=" font-medium text-lg text-nowrap w-38 "
                  htmlFor="storeLocation"
                >
                  Store Location
                </label>
                <input
                  type="text"
                  name="storeLocation"
                  value={data.storeLocation}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="storeLocation"
                  placeholder="Enter Store Location"
                  className=" w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex xl:flex-row flex-col  xl:items-center gap-3 mr-2 mb-4">
                <label
                  className=" font-medium text-lg text-nowrap w-38 "
                  htmlFor="stockUnit"
                >
                  Stock Unit
                </label>
                <input
                  type="text"
                  name="stockUnit"
                  value={data.stockUnit}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="stockUnit"
                  placeholder="Enter Stock Unit"
                  className=" w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex xl:flex-row flex-col  xl:items-center gap-3 mr-2 mb-4">
                <label
                  className=" font-medium text-lg text-nowrap w-36 "
                  htmlFor="barcodeSr"
                >
                  Barcode Sr
                </label>
                <input
                  type="text"
                  name="barcodeSr"
                  value={data.barcodeSr}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="barcodeSr"
                  placeholder="Enter Barcode Sr"
                  className=" w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex xl:flex-row flex-col  xl:items-center gap-3 lg:ml-80 mr-2 mb-4">
                <label
                  className=" font-medium text-lg text-nowrap  "
                  htmlFor="maximumStock"
                >
                  Maximum Stock
                </label>
                <input
                  type="Number"
                  name="maximumStock"
                  value={data.maximumStock}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="maximumStock"
                  placeholder="Enter Maximum Stock"
                  className=" w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="px-2 w-full ">
              <div className="grid lg:grid-cols-3 text-center gap-2 mb-5 ">
                <div className="flex flex-col gap-2">
                  <span className="border-2 py-3 ">Date</span>
                  <input
                    type="date"
                    className="border-2 py-3 text-center "
                    value={data.date}
                    name="date"
                    onChange={(e) =>
                      setData({ ...data, [e.target.name]: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="border-2 py-3 ">Retail</span>
                  <input
                    type="number"
                    className="border-2 py-3 text-center "
                    value={data.retail}
                    name="retail"
                    onChange={(e) =>
                      setData({ ...data, [e.target.name]: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="border-2 py-3 ">MRP</span>
                  <input
                    type="number"
                    className="border-2 py-3 text-center"
                    value={data.mrp}
                    name="mrp"
                    onChange={(e) =>
                      setData({ ...data, [e.target.name]: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex lg:flex-row flex-col  xl:items-center xl:justify-center ">
                {images.length > 0 ? (
                  <img
                    src={images[currentIndex]}
                    className="flex border-2 size-50 justify-center items-center transition-all duration-300"
                    alt="Preview"
                    style={{ transform: `scale(${zoom})` }}
                  />
                ) : (
                  <p className="flex border-2 size-50 justify-center items-center ">
                    No Image Selected
                  </p>
                )}
                <div className="flex flex-col gap-2 lg:px-5 py-5 ">
                  <button
                    type="button"
                    value=""
                    className="border-2 px-10 py-1"
                    onClick={() => inputref.current.click()}
                  >
                    Add
                  </button>
                  <input
                    type="file"
                    value=""
                    ref={inputref}
                    accept="image/*"
                    onChange={handleImageAdd}
                    className=" hidden"
                  />

                  <button
                    type="submit"
                    value=""
                    className="border-2 px-10 py-1"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    value=""
                    className="border-2 px-10 py-1"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                  <button
                    type="submit"
                    value=""
                    className="border-2 px-10 py-1"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    value=""
                    className="border-2 px-10 py-1"
                    onClick={handleZoom}
                  >
                    Zoom
                  </button>
                </div>
              </div>
              <hr />

              <div className="flex xl:flex-row flex-col xl:items-center gap-3 mr-2 mb-4 mt-5">
                <label
                  className=" font-medium text-lg text-nowrap lg:w-36"
                  htmlFor="ingredients"
                >
                  Ingredients
                </label>
                <input
                  type="text"
                  name="ingredients"
                  value={data.ingredients}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="ingredients"
                  placeholder="Enter Ingredients Group"
                  className="w-full p-2  border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex xl:flex-row flex-col xl:items-center gap-3 mr-2 mb-4">
                <label
                  className=" font-medium text-lg text-nowrap lg:w-36"
                  htmlFor="benefits"
                >
                  Benefits
                </label>
                <input
                  type="text"
                  name="benefits"
                  value={data.benefits}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  id="ingredients"
                  placeholder="Enter Benefits Group"
                  className="w-full p-2  border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
            >
              {id ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBrand;
