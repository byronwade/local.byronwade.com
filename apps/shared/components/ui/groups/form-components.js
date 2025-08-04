/**
 * Form Components Group
 * Optimized exports for form-related UI components
 * Reduces bundle size by allowing selective imports
 */

// Core form components
export { Button, buttonVariants } from "../button";
export { Input } from "../input";
export { Label } from "../label";
export { Textarea } from "../textarea";
export { Checkbox } from "../checkbox";
export { RadioGroup, RadioGroupItem } from "../radio-group";
export { Switch } from "../switch";
export { Slider } from "../slider";

// Advanced form components
export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField, useFormField } from "../form";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from "../select";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "../input-otp";
export { Calendar } from "../calendar";
export { Progress } from "../progress";

// Form validation helpers
export { toast, useToast } from "../use-toast";
export { Toaster } from "../toaster";
