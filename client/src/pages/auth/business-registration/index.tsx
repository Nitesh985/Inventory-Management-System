import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import axios from "axios";
import { useSession } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";

// Business types matching the backend model
const businessTypes = [
  { label: "Retail Store", value: "Retail Store" },
  { label: "Service Provider", value: "Service Provider" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Restaurant/Food", value: "Restaurant/Food" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Other", value: "Other" },
] as const;

// Validation schema matching the Shop model
const businessRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must be less than 100 characters"),
  businessType: z.enum(
    [
      "Retail Store",
      "Service Provider",
      "Manufacturing",
      "Restaurant/Food",
      "Healthcare",
      "Other",
    ],
    {
      required_error: "Please select a business type",
    }
  ),
  useBS: z.boolean().default(false),
});

type BusinessRegistrationFormData = z.infer<typeof businessRegistrationSchema>;

function BusinessRegistration() {
  const { refetch } = useSession();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BusinessRegistrationFormData>({
    resolver: zodResolver(businessRegistrationSchema),
    defaultValues: {
      name: "",
      businessType: undefined,
      useBS: false,
    },
  });

  const onSubmit = async (data: BusinessRegistrationFormData) => {
      try{
        console.log(data)
        await axios.post('/api/shops', data);
        
        // Refresh the session to get the updated shopId
        await refetch();
        
        // Navigate to dashboard or wherever you want after shop creation
        navigate('/dashboard');
      } catch(error){
        console.error(error);
      }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Register Your Business
          </h1>
          <p className="text-muted-foreground">
            Set up your business profile to get started with inventory
            management
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Name */}
            <Input
              label="Business Name"
              placeholder="Enter your business name"
              required
              error={errors.name?.message}
              {...register("name")}
            />

            {/* Business Type */}
            <Controller
              name="businessType"
              control={control}
              render={({ field }) => (
                <Select
                  label="Business Type"
                  placeholder="Select your business type"
                  options={businessTypes}
                  value={field.value}
                  onChange={field.onChange}
                  required
                  error={errors.businessType?.message}
                />
              )}
            />

            {/* Use Bikram Sambat Calendar */}
            <Controller
              name="useBS"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Use Bikram Sambat (BS) Calendar"
                  description="Enable Nepali calendar dates for your business records"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              className="mt-4"
            >
              Register Business
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have a business registered?{" "}
          <a href="/signin" className="text-primary hover:underline font-medium">
            Sign in instead
          </a>
        </p>
      </div>
    </div>
  );
}

export default BusinessRegistration;
