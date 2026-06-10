"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { RefreshCwIcon } from "lucide-react";
import { useState } from "react";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const displayUsername = params?.username
    ? decodeURIComponent(params.username)
    : "User";

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: params.username,
          code: data.code,
        }),
      });

      const resData: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          resData.message || "An error occurred. Please try again.",
        );
      }

      toast({
        title: "Success",
        description: resData.message || "Account verified successfully.",
      });

      const pendingCredentials =
        typeof window !== "undefined"
          ? sessionStorage.getItem("tradeledger_pending_signup_credentials")
          : null;

      if (pendingCredentials) {
        const credentials = JSON.parse(pendingCredentials) as {
          identifier: string;
          password: string;
        };

        sessionStorage.removeItem("tradeledger_pending_signup_credentials");

        const signInResponse = await signIn("credentials", {
          redirect: false,
          identifier: credentials.identifier,
          password: credentials.password,
        });

        if (signInResponse?.error) {
          router.replace("/sign-in");
          return;
        }

        router.replace("/dashboard");
        return;
      }

      router.replace("/sign-in");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending) return;
    setIsResending(true);
    try {
      const response = await fetch(`/api/resend-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: params.username }),
      });

      const resData: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Could not resend code.");
      }

      toast({
        title: "Code Sent",
        description:
          "A fresh 6-digit verification code has been delivered to your inbox.",
      });
    } catch (error: any) {
      toast({
        title: "Resend Failed",
        description: error.message || "Could not resend code.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleContactSupport = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    toast({
      title: "Feature coming soon",
      description:
        "Our direct ticketing system is currently under construction.",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4 text-foreground transition-colors duration-300">
      <Card className="w-full max-w-md shadow-2xl border border-border bg-card backdrop-blur-sm overflow-hidden">
        <CardHeader className="space-y-2 text-center p-5 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Verify Account
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto balance">
            Hello{" "}
            <span className="font-semibold text-primary">
              {displayUsername}
            </span>
            , please enter the 6-digit verification code sent to your email.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 p-4 sm:p-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-between w-full px-1">
                      <FormLabel className="text-[10px] sm:text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Verification Code
                      </FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isResending}
                        className="text-xs h-8 text-primary bg-transparent hover:bg-transparent hover:opacity-80 transition-all duration-200 gap-1.5 p-0"
                        onClick={handleResendCode}
                      >
                        <RefreshCwIcon
                          className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : "transition-transform duration-500 hover:rotate-180"}`}
                        />
                        Resend Code
                      </Button>
                    </div>

                    {/* Responsive Container for Keypads & Viewports */}
                    <div className="w-full flex justify-center py-1 overflow-x-auto no-scrollbar">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        id="otp-verification"
                      >
                        <InputOTPGroup className="gap-1 sm:gap-2">
                          {[0, 1, 2].map((idx) => (
                            <InputOTPSlot
                              key={idx}
                              index={idx}
                              className="h-11 w-9 sm:h-14 sm:w-12 text-lg sm:text-2xl font-bold border-2 border-input bg-background rounded-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary text-center"
                            />
                          ))}
                        </InputOTPGroup>
                        <InputOTPSeparator className="mx-1 sm:mx-2 text-muted-foreground font-bold" />
                        <InputOTPGroup className="gap-1 sm:gap-2">
                          {[3, 4, 5].map((idx) => (
                            <InputOTPSlot
                              key={idx}
                              index={idx}
                              className="h-11 w-9 sm:h-14 sm:w-12 text-lg sm:text-2xl font-bold border-2 border-input bg-background rounded-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary text-center"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <FormMessage className="text-center w-full font-medium text-xs" />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 p-4 sm:p-6">
              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.99] transition-all rounded-xl shadow-md"
                disabled={isSubmitting || form.watch("code")?.length !== 6}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <RefreshCwIcon className="h-4 w-4 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  "Verify Account"
                )}
              </Button>

              <div className="text-center text-[11px] sm:text-xs text-muted-foreground space-y-1">
                <p>
                  Having trouble signing in?{" "}
                  <a
                    href="#"
                    onClick={handleContactSupport}
                    className="underline underline-offset-4 hover:text-primary transition-colors font-medium whitespace-nowrap"
                  >
                    Contact support
                  </a>
                </p>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
