import { useState } from "react";

import FarmerForm from "../../components/farmers/FarmerForm";

import API from "../../services/api";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

const AddFarmer = () => {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const addFarmer = async (
    formData
  ) => {

    try {

      setLoading(true);

      await API.post(
        "/farmers",
        formData
      );

      toast.success(
        "Farmer Added Successfully"
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

  return (
    <div>

      <h1 className="text-3xl font-bold mb-5">
        Add Farmer
      </h1>

      <FarmerForm
        onSubmit={addFarmer}
        loading={loading}
      />

    </div>
  );
};

export default AddFarmer;