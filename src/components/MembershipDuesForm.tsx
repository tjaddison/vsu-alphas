import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }).max(50, { message: "First name must be less than 50 characters" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }).max(50, { message: "Last name must be less than 50 characters" }),
  mobile: z.string().trim().regex(/^[\d\s\-\(\)\+]+$/, { message: "Please enter a valid mobile number" }).min(10, { message: "Mobile number is required" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  homeAddress: z.string().trim().min(1, { message: "Home address is required" }).max(200, { message: "Address must be less than 200 characters" }),
  yearGraduated: z.string().trim().optional(),
  yearCrossed: z.string().trim().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function MembershipDuesForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      homeAddress: "",
      yearGraduated: "",
      yearCrossed: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.from("membership_dues").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        mobile: data.mobile,
        email: data.email,
        home_address: data.homeAddress,
        year_graduated: data.yearGraduated || null,
        year_crossed: data.yearCrossed || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Information Received",
        description: "Thank you for submitting your information. Please complete payment via CashApp or Zelle.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CASHAPP_LINK = "https://cash.app/$VSUAlphas";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            VSU Alphas Alumni Chapter
          </h1>
          <p className="text-muted-foreground text-lg">
            Annual Membership Payment Form
          </p>
        </div>

        <Card className="shadow-[var(--shadow-elegant)] border-2">
          <CardContent className="pt-6">
            {!isSubmitted ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            First Name <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} className="border-2 focus:border-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Last Name <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} className="border-2 focus:border-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          Mobile Number <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="(555) 123-4567" 
                            {...field} 
                            className="border-2 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          Email Address <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="john.doe@example.com" 
                            {...field} 
                            className="border-2 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="homeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          Home Address <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123 Main St, City, State, ZIP" 
                            {...field} 
                            className="border-2 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearGraduated"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Graduated</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 2015" 
                            {...field} 
                            className="border-2 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearCrossed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Crossed</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 2015" 
                            {...field} 
                            className="border-2 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 border-t">
                    <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <span className="text-2xl">💰</span>
                        Dues Payment Information
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Annual dues: <span className="font-bold text-foreground text-xl">$75.00</span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        After submitting this form, please complete your payment using one of the options below:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <a
                          href={CASHAPP_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-[#00C853] hover:bg-[#00B04A] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                          Pay via CashApp
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <div className="bg-primary/10 border-2 border-primary/20 rounded-lg p-4">
                          <p className="font-semibold text-sm mb-1">Pay via Zelle</p>
                          <p className="text-lg font-bold text-primary">804-536-4380</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold text-lg py-6"
                    >
                      Submit Information
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="text-center py-12 space-y-6">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-primary">Thank You!</h3>
                <p className="text-muted-foreground">
                  Your information has been received. Please complete your $75 dues payment using one of the options below.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href={CASHAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#00C853] hover:bg-[#00B04A] text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
                  >
                    Pay via CashApp
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <div className="bg-primary/10 border-2 border-primary/20 rounded-lg p-4 min-w-[200px]">
                    <p className="font-semibold text-sm mb-1">Pay via Zelle</p>
                    <p className="text-xl font-bold text-primary">804-536-4380</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>For questions, please contact your chapter treasurer.</p>
        </div>
      </div>
    </div>
  );
}
