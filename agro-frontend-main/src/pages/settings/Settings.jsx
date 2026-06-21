import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

import toast from "react-hot-toast";

const Settings = () => {

  const [settings, setSettings] =
    useState({

      // shop details

      shopName: "",
      shopAddress: "",
      shopMobile: "",
      shopEmail: "",

      // gst

      gstNumber: "",
      gstPercentage: "",

      // bank

      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",

      // interest

      monthlyInterestRate: "",
      autoInterestEnabled: true,

      // reminders

      reminderDaysBeforeDue: "",
      overdueReminderEnabled: true,
      lowStockAlertEnabled: true,
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);



  // ================= GET SETTINGS =================

  const getSettings =
    async () => {

      try {

        const { data } =
          await API.get(
            "/settings"
          );

        setSettings(
          data.settings
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Unable to load settings"
        );

      } finally {

        setLoading(false);
      }
    };



  // ================= INPUT CHANGE =================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSettings((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };



  // ================= UPDATE SETTINGS =================

  const updateSettings =
    async (e) => {

      e.preventDefault();

      try {

        setSaving(true);

        await API.put(
          "/settings",
          settings
        );

        toast.success(
          "Settings Updated"
        );

      } catch (error) {

        console.log(error);

        toast.error(
          error.response?.data?.message ||
          "Save failed"
        );

      } finally {

        setSaving(false);
      }
    };



  useEffect(() => {
    getSettings();
  }, []);



  if (loading) {
    return (
      <div className="text-center py-10">
        Loading settings...
      </div>
    );
  }



  return (
    <div className="max-w-5xl">

      <h1 className="text-3xl font-bold mb-6">
        Settings
      </h1>



      <form
        onSubmit={
          updateSettings
        }
        className="bg-white p-6 rounded-xl shadow space-y-8"
      >

        {/* ================= SHOP DETAILS ================= */}

        <div>

          <h2 className="text-xl font-bold mb-4">
            Shop Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              name="shopName"
              placeholder="Shop Name"
              value={
                settings.shopName
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="shopMobile"
              placeholder="Shop Mobile"
              value={
                settings.shopMobile
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="email"
              name="shopEmail"
              placeholder="Shop Email"
              value={
                settings.shopEmail
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="shopAddress"
              placeholder="Shop Address"
              value={
                settings.shopAddress
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

          </div>
        </div>



        {/* ================= GST DETAILS ================= */}

        <div>

          <h2 className="text-xl font-bold mb-4">
            GST Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              name="gstNumber"
              placeholder="GST Number"
              value={
                settings.gstNumber
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="gstPercentage"
              placeholder="GST Percentage"
              value={
                settings.gstPercentage
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

          </div>
        </div>



        {/* ================= BANK DETAILS ================= */}

        <div>

          <h2 className="text-xl font-bold mb-4">
            Bank Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              name="bankName"
              placeholder="Bank Name"
              value={
                settings.bankName
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="accountHolderName"
              placeholder="Account Holder Name"
              value={
                settings.accountHolderName
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="accountNumber"
              placeholder="Account Number"
              value={
                settings.accountNumber
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="ifscCode"
              placeholder="IFSC Code"
              value={
                settings.ifscCode
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

          </div>
        </div>



        {/* ================= INTEREST SETTINGS ================= */}

        <div>

          <h2 className="text-xl font-bold mb-4">
            Interest Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="number"
              name="monthlyInterestRate"
              placeholder="Monthly Interest Rate"
              value={
                settings.monthlyInterestRate
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="autoInterestEnabled"
                checked={
                  settings.autoInterestEnabled
                }
                onChange={
                  handleChange
                }
              />

              Auto Interest Enabled

            </label>

          </div>
        </div>



        {/* ================= REMINDER SETTINGS ================= */}

        <div>

          <h2 className="text-xl font-bold mb-4">
            Reminder Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="number"
              name="reminderDaysBeforeDue"
              placeholder="Reminder Days Before Due"
              value={
                settings.reminderDaysBeforeDue
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
            />

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="overdueReminderEnabled"
                checked={
                  settings.overdueReminderEnabled
                }
                onChange={
                  handleChange
                }
              />

              Overdue Reminder Enabled

            </label>

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="lowStockAlertEnabled"
                checked={
                  settings.lowStockAlertEnabled
                }
                onChange={
                  handleChange
                }
              />

              Low Stock Alert Enabled

            </label>

          </div>
        </div>



        {/* ================= BUTTON ================= */}

        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-60"
        >
          {
            saving
              ? "Saving..."
              : "Save Settings"
          }
        </button>

      </form>
    </div>
  );
};

export default Settings;