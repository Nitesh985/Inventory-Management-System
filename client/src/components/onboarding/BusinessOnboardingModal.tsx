import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Logo from "@/assets/logo.png";
import axios from "axios";

interface Props {
  onComplete: () => void;
}

const inputClass =
  "w-full py-3 px-4 border-2 border-gray-200 rounded-lg " +
  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 " +
  "focus:shadow-lg transition-all text-sm bg-white/90 " +
  "hover:bg-white hover:border-gray-300";

export default function BusinessOnboardingModal({ onComplete }: Props) {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    businessType: "Retail Store",
    useBS: true,
    province: "",
    district: "",
    city: "",
    address: "",
    panNumber: "",
    vatNumber: "",
    phone: "",
    email: "",
  });
  
  const handleSubmit = async () => {
    await axios.post("/api/shops", form)
    onComplete()
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-7 text-white">
        <div className="flex items-center gap-4">
          <img src={Logo} className="h-12 w-12 bg-white rounded-xl p-1" />
          <div>
            <h1 className="text-2xl font-bold">Set up your business</h1>
            <p className="text-sm opacity-90">
              Almost there — just a few more details
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-10 py-10 space-y-10">
        {/* STEP INDICATOR */}
        <div className="flex gap-3">
          {["Business", "Location", "Legal", "Finish"].map((s, i) => (
            <div
              key={s}
              className={`flex-1 py-2.5 text-center rounded-full text-sm font-semibold transition
                ${
                  step === i + 1
                    ? "bg-blue-600 text-white shadow"
                    : step > i + 1
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }
              `}
            >
              {s}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Business details
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Basic information about your business
                </p>
              </div>
          
              {/* Business Name & Type */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  placeholder="Business name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={inputClass} // SAME height
                />
          
                <select
                  value={form.businessType}
                  onChange={(e) =>
                    setForm({ ...form, businessType: e.target.value })
                  }
                  className={inputClass} // SAME height
                >
                  <option value="">Select business type</option>
                  <option>Retail Store</option>
                  <option>Service Provider</option>
                  <option>Restaurant</option>
                  <option>Manufacturing</option>
                  <option>Other</option>
                </select>
              </div>
          
              {/* Preferences */}
              <div className="flex flex-wrap items-center gap-6">
                {/* Bikram Sambat */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.useBS}
                    onChange={(e) =>
                      setForm({ ...form, useBS: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Use Bikram Sambat (BS)
                  </span>
                </label>
          
                {/* Currency selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Currency
                  </span>
          
                  {/*<select
                    value={form.currency}
                    onChange={(e) =>
                      setForm({ ...form, currency: e.target.value })
                    }
                    className="h-9 px-3 rounded-lg border border-gray-300
                               text-sm bg-white focus:outline-none
                               focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NPR">NPR</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>*/}
                </div>
              </div>
            </div>
          </div> 
        )}



        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Business location</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                placeholder="Province"
                className={inputClass}
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
              />
              <Input
                placeholder="District"
                className={inputClass}
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
              <Input
                placeholder="City"
                className={inputClass}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <Input
                placeholder="Full address"
                className={inputClass}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Legal & contact</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                placeholder="PAN number"
                className={inputClass}
                value={form.panNumber}
                onChange={(e) => setForm({ ...form, panNumber: e.target.value })}
              />
              <Input
                placeholder="VAT number (optional)"
                className={inputClass}
                value={form.vatNumber}
                onChange={(e) => setForm({ ...form, vatNumber: e.target.value })}
              />
              <Input
                placeholder="Phone number"
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                placeholder="Email address"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold">You're ready 🎉</h2>
            <p className="text-gray-600 mt-2">
              Your business setup is complete.
            </p>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-between pt-6">
          {step > 1 ? (
            <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button size="lg" onClick={() => setStep(step + 1)}>
              Continue
            </Button>
          ) : (
            <Button size="lg" onClick={handleSubmit}>
              Enter Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
