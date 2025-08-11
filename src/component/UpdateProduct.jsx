import { useEffect, useRef, useState } from "react";
import img from "./Images/admin.jpg";
import { app } from "./firebase";
import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";

import { toast, ToastContainer } from "react-toastify";
import firebase from "firebase/compat/app";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import { useDropdownData } from "./store/ProductContext";




const UpdateProduct = () => {
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
  });

  const { itemGroups, brands, } = useDropdownData();

  const db = getFirestore(app);
  const navigate = useNavigate();
  const { id } = useParams();
  // code of image viewer
  const [images, setImages] = useState([]); // Store image URLs
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const inputref = useRef();

  // const [itemGroups, setItemGroups] = useState(false);
  // const [brands, setBrands] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error("No product ID");
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const prod = docSnap.data();
          setData(prod);
          setImages(prod.image || []);
        } else {
          toast.error("Product not found");
          navigate("/");
        }
      } catch (error) {
        toast.error("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

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
        // console.error("Upload error:", err);
        toast.error("Image upload failed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...data, image: images };
      if (id) {
        await updateDoc(doc(db, "products", id), payload);
        toast.success("Product updated successfully");
      }
      clearData();
      navigate("/products");
    } catch (error) {
      // console.error("Error saving product:", error);

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
    });
  };

  // Add image (simulate file picker)
  const handleAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages([...images, url]);
      setCurrentIndex(images.length); // Move to the newly added image
    }
  };

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

  return (
    <>
      <ToastContainer position="bottom-right" />
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 mt-4">
        {id ? "Edit Product" : "Add Product"}
      </h2>
      <div
        className="xl:w-full 
       py-4 flex lg:flex-col bg-white px-2 rounded-2xl shadow-md "
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 flex xl:flex-row flex-col ">
            <div className=" xl:w-1/2 w-full 2xl:border-r-2 border-r-2">
              {/* Product Name */}
              <div className="flex xl:flex-row flex-col xl:items-center gap-3 mr-2 mb-4">
                <label
                  className=" font-medium text-lg text-nowrap lg:w-36"
                  htmlFor="itemGroup"
                >
                  Item Group
                </label>
                <Autocomplete
                  className="w-full"
                  id="free-solo-demo"
                  size="small"
                  freeSolo
                  options={(Array.isArray(itemGroups) ? itemGroups : []).map(
                    (item) => item.itemName
                  )}
                  value={data.itemGroup}
                  onChange={(_, value) =>
                    setData({ ...data, itemGroup: value || "" })
                  }
                  onInputChange={(_, value) =>
                    setData({ ...data, itemGroup: value })
                  }
                  renderInput={(params) => (
                    <TextField {...params}  fullWidth />
                  )}
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
                <Autocomplete
                  className="w-full"
                  id="free-solo-demo"
                  size="small"
                  freeSolo
                  options={(Array.isArray(brands) ? brands : []).map(
                    (item) => item.brandName
                  )}
                  value={data.brand}
                  onChange={(_, value) =>
                    setData({ ...data, brand: value || "" })
                  }
                  onInputChange={(_, value) =>
                    setData({ ...data, brand: value })
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth />
                  )}
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
                    onChange={handleAdd}
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

export default UpdateProduct;
