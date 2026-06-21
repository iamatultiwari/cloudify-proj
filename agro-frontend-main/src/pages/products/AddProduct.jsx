import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../../components/products/ProductsForm";
import API from "../../services/api";
import toast from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async (formData) => {
    try {
      setLoading(true);
      await API.post("/products", formData);
      toast.success("Product Added Successfully");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/products"
          className="p-3 bg-white border border-gray-200 rounded-2xl text-slate-800 hover:text-green-600 hover:border-green-200 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-slate-700 mt-1">Register a new item in your inventory</p>
        </div>
      </div>

      <ProductForm 
        onSubmit={handleAddProduct} 
        loading={loading} 
      />
    </div>
  );
};

export default AddProduct;