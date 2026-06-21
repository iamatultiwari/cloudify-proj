import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import API from "../../services/api";

import FarmerForm from "../../components/farmers/FarmerForm";

import toast from "react-hot-toast";

const EditFarmer = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [farmer, setFarmer] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // ================= GET SINGLE =================

  const getFarmer = async () => {

    try {

      const { data } =
        await API.get(
          `/farmers/${id}`
        );

      setFarmer(data.farmer);

    } catch (error) {
      console.log(error);
    }
  };

  // ================= UPDATE =================

  const updateFarmer = async (
    formData
  ) => {

    try {

      setLoading(true);

      await API.put(
        `/farmers/${id}`,
        formData
      );

      toast.success(
        "Farmer Updated"
      );

      navigate("/farmers");

    } catch (error) {

      toast.error(
        error.response?.data?.message
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    getFarmer();
  }, []);

  if (!farmer) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-5">
        Edit Farmer
      </h1>

      <FarmerForm
        initialData={farmer}
        onSubmit={updateFarmer}
        loading={loading}
      />

    </div>
  );
};

export default EditFarmer;