import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import API from "../../services/api";
import ProductForm from "../../components/products/ProductsForm";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
      } catch (error) {
        toast.error("Failed to fetch product details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setUpdateLoading(true);
      await API.put(`/products/${id}`, formData);
      toast.success("Product Updated Successfully");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin text-green-600" size={40} />
        <p className="text-slate-700 font-medium">Loading product information...</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-slate-700 mt-1">Update information for {product?.productName}</p>
        </div>
      </div>

      <ProductForm 
        initialData={product} 
        onSubmit={handleUpdate} 
        loading={updateLoading} 
      />
    </div>
  );
};

export default EditProduct;